import type { Ship, Game, CustomWebSocket, Attack } from './types/index';
import { wsSend } from './utility';

class Games {
  private games: Game[] = [];

  createGame({
    gameId,
    players,
  }: {
    gameId: string;
    players: { index: string; ws: CustomWebSocket }[];
  }) {
    const newGame: Game = {
      id: gameId,
      players: {
        [players[0].index]: {
          ships: [],
          attacks: [],
          ws: players[0].ws,
          shipPositions: {},
        },
        [players[1].index]: {
          ships: [],
          attacks: [],
          ws: players[1].ws,
          shipPositions: {},
        },
      },
      currentPlayer: players[1].index,
    };

    this.games.push(newGame);

    return newGame;
  }

  addShips(data: {
    gameId: number | string;
    ships: Ship[];
    indexPlayer: number | string;
  }) {
    const game = this.games.find((game) => (game.id = data.gameId));

    if (!game) {
      throw new Error(`The game with ${data.gameId} id not exists`);
    }

    game.players[data.indexPlayer].ships = data.ships;

    const shipPositions = this.getShipPosition(
      game.players[data.indexPlayer].ships,
    );

    game.players[data.indexPlayer].shipPositions = shipPositions;

    const isReady = this.checkGameReady(game);

    if (!isReady) {
      return;
    }

    this.startGame(game);
    this.turnPlayer(game);
  }

  getShipPosition(ships: Ship[]) {
    const shipPositions: Record<string, Ship> = {};

    ships.forEach((ship) => {
      for (let i = 0; i < ship.length; i++) {
        const x = ship.position.x + (ship.direction ? 0 : i);
        const y = ship.position.y + (ship.direction ? i : 0);
        const key = `${x}${y}`;
        shipPositions[key] = ship;
      }
    });

    return shipPositions;
  }

  startGame(game: Game) {
    Object.entries(game.players).forEach(([playerIndex, playerData]) => {
      wsSend(playerData.ws, 'start_game', {
        currentPlayerIndex: playerIndex,
        ships: playerData.ships,
      });
    });
  }

  turnPlayer(game: Game) {
    const [firstPlayerId, secondPlayerId] = Object.keys(game.players);
    const currentPlayer =
      game.currentPlayer === firstPlayerId ? secondPlayerId : firstPlayerId;

    game.currentPlayer = currentPlayer;

    [firstPlayerId, secondPlayerId].forEach((id) => {
      wsSend(game.players[id].ws, 'turn', {
        currentPlayer,
      });
    });
  }

  checkGameReady(game: Game) {
    return Object.values(game.players).every(({ ships }) => ships.length);
  }

  attack(attack: Attack) {
    const game = this.getGame(String(attack.gameId));
    const enemy = this.getEnemy(game);

    const attackPosition = `${attack.x}${attack.y}`;

    const hitShip: Ship | undefined = enemy.shipPositions[attackPosition];

    if (hitShip) {
      const health = hitShip.length - 1;
      const status = health <= 0 ? 'killed' : 'shot';

      wsSend(game.players[game.currentPlayer].ws, 'attack', {
        position: { x: attack.x, y: attack.y },
        currentPlayer: game.currentPlayer,
        status,
      });
    } else {
      wsSend(game.players[game.currentPlayer].ws, 'attack', {
        position: { x: attack.x, y: attack.y },
        currentPlayer: game.currentPlayer,
        status: 'miss',
      });

      if (status === 'killed' && this.checkFinish(game)) {
      }

      this.turnPlayer(game);
    }
  }

  checkFinish(game: Game) {}

  getEnemy(game: Game) {
    const enemyId = Object.keys(game.players).find(
      (id) => id !== game.currentPlayer,
    );

    if (!enemyId) {
      throw new Error(`The enemy id not found`);
    }

    const enemy = game.players[enemyId];

    if (!enemy) {
      throw new Error(`The enemy  not found`);
    }

    return enemy;
  }

  getGame(gameId: string) {
    const game = this.games.find((game) => game.id === gameId);

    if (!game) {
      throw new Error(`The game with ${gameId} id not exists`);
    }

    return game;
  }
}

export const games = new Games();

// const attack = {
//   x: 4,
//   y: 4,
//   gameId: '3aee3fd2-801c-40d8-9355-cdfdf9c2a257',
//   indexPlayer: 'c240dfd7-5bc3-441e-83fb-16349b9fedb5',
// };
