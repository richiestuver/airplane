import * as PIXI from "pixi.js";

const MAX_SPEED = 25.0;
const MIN_SPEED = 0.0;

(async () => {
    let app: PIXI.Application = await initApp();
    let airplane = initAirplane(app);
    let clouds = new PIXI.Container();
    clouds.zIndex = -Infinity;
    app.stage.addChild(clouds);

    let keypress: string = "";
    (() => {
        window.addEventListener("keydown", (event) => {
            keypress = event.code;
        });

        window.addEventListener("keyup", (_) => {
            keypress = "";
        });
    })();

    let [_, textSpeed, textYaw] = setupText(app);
    let airspeed: number = 0.0;
    let yaw: number = 0.0;

    const trajectory = new PIXI.Graphics()
        .moveTo(0, -25)
        .lineTo(0, -app.screen.height)
        .stroke({
            color: "white",
            width: 10,
            alpha: 0.4,
        });
    airplane.addChild(trajectory);

    let elapsed: number = 0;
    app.ticker.add((ticker) => {
        elapsed += Math.floor(ticker.deltaTime);
        let [delta_yaw, delta_speed] = handleKeypress(keypress);

        yaw += delta_yaw;
        airspeed = Math.max(
            Math.min(airspeed + delta_speed, MAX_SPEED),
            MIN_SPEED
        );
        moveAirplane(app, airplane, yaw, airspeed);

        if (elapsed % 2 == 0) {
            updateCloudTrail(airplane, clouds);
        }
        updateLegend(airspeed, yaw, textSpeed, textYaw);
    });

    document.body.appendChild(app.canvas);
})();

function initAirplane(app: PIXI.Application): PIXI.Sprite {
    let airplane = PIXI.Sprite.from("/plane.png");
    airplane.eventMode = "static";
    airplane.x = app.screen.width / 2;
    airplane.y = app.screen.height / 2;
    airplane.anchor.set(0.5);
    app.stage.addChild(airplane);
    airplane.zIndex = Infinity;
    return airplane;
}

async function initApp(): Promise<PIXI.Application> {
    const app = new PIXI.Application();

    await app.init({
        resizeTo: window,
        backgroundColor: "LightSeaGreen", //0x87ceeb,
    });

    app.canvas.style.position = "absolute";

    await PIXI.Assets.load("/plane.png");
    await PIXI.Assets.load("/cloud2.png");
    return app;
}

function setupText(app: PIXI.Application): PIXI.Text[] {
    const textInstructions = new PIXI.Text({
        text: "SPEED: UP / DOWN Arrow Keys (↑ ↓)\nYAW: LEFT / RIGHT Arrow Keys (← →)",
    });
    const textSpeed = new PIXI.Text({ text: `Speed: 0.0 knots` });
    const textYaw: PIXI.Text = new PIXI.Text({
        text: `Yaw: 00.0 degrees`,
    });

    textInstructions.x = 50;
    textInstructions.y = 50;
    textSpeed.x = 50;
    textSpeed.y = 150;
    textYaw.x = 50;
    textYaw.y = 200;
    app.stage.addChild(textInstructions);
    app.stage.addChild(textSpeed);
    app.stage.addChild(textYaw);

    return [textInstructions, textSpeed, textYaw];
}

function updateLegend(
    airspeed: number,
    yaw: number,
    textSpeed: PIXI.Text,
    textYaw: PIXI.Text
) {
    textSpeed.text = `Speed: ${airspeed.toFixed(1)} knots`;
    textYaw.text = `Yaw: ${Math.abs((yaw * (180 / Math.PI)) % 360).toFixed(
        1
    )} degrees`;
}
function updateCloudTrail(airplane: PIXI.Sprite, path: PIXI.Container) {
    let cloud = PIXI.Sprite.from("/cloud2.png");
    cloud.scale = 0.025;
    cloud.anchor.set(0.5, 0.5);
    cloud.x = airplane.x;
    cloud.y = airplane.y;
    path.addChild(cloud);

    if (path.children.length > 100) {
        path.removeChildAt(0);
    }
}

function moveAirplane(
    app: PIXI.Application,
    airplane: PIXI.Sprite,
    yaw: number,
    airspeed: number
) {
    airplane.rotation = yaw;
    airplane.x = (() => {
        let x: number =
            (airplane.x + airspeed * Math.cos(Math.PI / 2 - yaw)) %
            app.screen.width;

        if (x < 0) {
            x = app.screen.width - x;
        }

        return x;
    })();

    airplane.y = (() => {
        let y =
            (airplane.y + airspeed * -Math.sin(Math.PI / 2 - yaw)) %
            app.screen.height;

        if (y < 0) {
            y = app.screen.height - y;
        }
        return y;
    })();
}

function handleKeypress(key: string): [number, number] {
    let [delta_yaw, delta_speed] = [0.0, 0.0];
    switch (key) {
        case "ArrowUp":
            delta_speed += 0.1;
            break;
        case "ArrowDown":
            delta_speed -= 0.1;
            break;
        case "ArrowLeft":
            delta_yaw = -0.1;
            break;
        case "ArrowRight":
            delta_yaw = 0.1;
            break;
    }

    return [delta_yaw, delta_speed];
}
