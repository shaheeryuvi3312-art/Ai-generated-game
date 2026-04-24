/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Point = { x: number; y: number };

export interface Track {
  id: string;
  title: string;
  artist: string;
  cover: string;
  audioUrl: string; // Dummy URL for demo
}

export type GameState = 'IDLE' | 'PLAYING' | 'GAMEOVER';
