import { handleMuggerDamage, playMuggerComplaint } from "./mugger.js";
import { handleFailScenario } from "./screens.js";

// Player, Mugger, Purse collide with floor
export function handleFloorCollissions(scene) {
  scene.physics.add.collider(scene.player, scene.floor);
  scene.physics.add.collider(scene.mugger, scene.floor);
  scene.physics.add.collider(scene.girl, scene.floor);
}

export function handleProjectilesMuggerCollission(scene) {
  // Mugger projectiles collision
  scene.projectiles = scene.physics.add.group();
  scene.physics.add.collider(
    scene.projectiles,
    scene.mugger,
    (mugger, projectile) => {
      if (mugger.mood !== "dead" && scene.girl.mood !== "dead") {
        handleMuggerDamage(projectile, mugger, scene, 1);
        playMuggerComplaint(scene);
      }
      projectile.destroy();
    }
  );
}

export function handleBulletGirlCollission(scene) {
  // Bullet girl collission
  scene.bullets = scene.physics.add.group();
  scene.physics.add.collider(scene.bullets, scene.girl, (girl, bullet) => {
    if (scene.mugger.mood !== "dead") {
      bullet.destroy();
      scene.backgroundMusic.stop();
      handleFailScenario(scene);
    }
  });
}

export function handleMuggerGirlCollission(scene) {
  // Mugger touching girl = insta kill
  scene.physics.add.collider(scene.mugger, scene.girl, (mugger, girl) => {
    mugger.x += 50; // move him back
    handleFailScenario(scene);
  });
}

export function handlePurseBulletCollission(scene) {
  // Purse destroys bullet
  scene.physics.add.collider(scene.bullets, scene.player, (player, bullet) => {
    bullet.destroy();
  });
}
