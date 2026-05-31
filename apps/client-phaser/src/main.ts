import Phaser from 'phaser';

import './style.css';

import { createBuildTowerCommand, createRenderSnapshot, createStartWaveCommand } from '@utd/game-core';

const app = document.querySelector<HTMLDivElement>('#app');
if (!app) throw new Error('Missing app root');
app.innerHTML = '<div id="controls"><button id="build">Build tower</button></div><div id="game"></div>';

let tick = 0;
let nextClientSeq = 2;
const commands = [createStartWaveCommand(), createBuildTowerCommand()];
let snapshot = createRenderSnapshot({ tick, commands });

class HarnessScene extends Phaser.Scene {
  private graphics?: Phaser.GameObjects.Graphics;
  private hudText?: Phaser.GameObjects.Text;

  constructor() {
    super('harness');
  }

  create(): void {
    this.graphics = this.add.graphics();
    this.hudText = this.add.text(8, 8, '', { color: '#ffffff', fontFamily: 'sans-serif', fontSize: '16px' });
    this.renderSnapshot();
  }

  update(): void {
    this.renderSnapshot();
  }

  private renderSnapshot(): void {
    if (!this.graphics || !this.hudText) return;
    const graphics = this.graphics;
    this.graphics.clear();
    graphics.lineStyle(4, 0x5dade2, 1);
    const [first, ...rest] = snapshot.path;
    if (first) {
      graphics.beginPath();
      graphics.moveTo(first.x, first.y);
      rest.forEach((point) => graphics.lineTo(point.x, point.y));
      graphics.strokePath();
    }
    snapshot.towers.forEach((tower) => {
      graphics.fillStyle(0x2ecc71, 1);
      graphics.fillRect(tower.x - 14, tower.y - 14, 28, 28);
    });
    snapshot.enemies.forEach((enemy) => {
      graphics.fillStyle(0xe74c3c, 1);
      graphics.fillCircle(enemy.x, enemy.y, 10);
    });
    this.hudText.setText([
      `Lives: ${snapshot.hud.lives}`,
      `Gold: ${snapshot.hud.gold}`,
      `Wave: ${snapshot.hud.wave}`,
      `HP: ${snapshot.enemies[0]?.health ?? 0}`
    ]);
  }
}

new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  width: 380,
  height: 240,
  backgroundColor: '#111827',
  scene: HarnessScene
});

window.setInterval(() => {
  tick = Math.min(tick + 1, 40);
  snapshot = createRenderSnapshot({ tick, commands });
}, 50);

document.querySelector<HTMLButtonElement>('#build')?.addEventListener('click', () => {
  commands.push(createBuildTowerCommand(tick, nextClientSeq));
  nextClientSeq += 1;
  snapshot = createRenderSnapshot({ tick, commands });
});
