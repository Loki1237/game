import { TANK_MATRIX } from '../models/Tank';
import { DefaultMap } from '../maps/Default';

export default class Engine {
    private GAME_FIELD: HTMLCanvasElement;
    private GAME_FIELD_CTX: CanvasRenderingContext2D;
    private GAME_FIELD_MATRIX: number[][] = [];
    private GAME_FIELD_MATRIX_WIDTH = 0;
    private GAME_FIELD_MATRIX_HEIGHT = 0;
    private PIXEL_SIZE = 2;
    private TANK_SIZE = 16;
    private TANK_POSITION = { X: 0, Y: 0 };
    private TANK_DIRECTION: "LEFT" | "TOP" | "RIGHT" | "BOTTOM" = "TOP";
    private COLORS = ["#080", "#880", "#F00"];
    private COOLDOWN = false;
    private TANK_TIMER = 0;

    constructor() {
        this.GAME_FIELD = <HTMLCanvasElement>document.getElementById("game_field");
        this.GAME_FIELD_CTX = <CanvasRenderingContext2D>this.GAME_FIELD.getContext("2d");

        const map = new DefaultMap(this.GAME_FIELD);

        this.GAME_FIELD.width = map.width;
        this.GAME_FIELD.height = map.height;

        this.initMatrix();
        map.init(this.GAME_FIELD_MATRIX);
        this.drowMap();
        this.drawTank();

        window.addEventListener("keydown", this.keyHandler);
    }

    private drowMap = () => {
        for (let r = 0; r < this.GAME_FIELD_MATRIX_HEIGHT; r++) {
            for (let c = 0; c < this.GAME_FIELD_MATRIX_WIDTH; c++) {
                if (this.GAME_FIELD_MATRIX[r][c] === 1) {
                    this.drawPixel( 
                        c * this.PIXEL_SIZE, 
                        r * this.PIXEL_SIZE, 
                        this.COLORS[0]
                    );
                }
            }
        }
    }

    private initMatrix = (): void => {
        for (let r = 0; r < this.GAME_FIELD.height; r += this.PIXEL_SIZE) {
            let row = [];
    
            for (let c = 0; c < this.GAME_FIELD.width; c += this.PIXEL_SIZE) {
                if (
                    r >= 0 * this.PIXEL_SIZE && r <= 20 * this.PIXEL_SIZE ||
                    r <= this.GAME_FIELD.height - this.PIXEL_SIZE && r >= this.GAME_FIELD.height - this.PIXEL_SIZE - 20 * this.PIXEL_SIZE ||
                    c >= 0 * this.PIXEL_SIZE && c <= 20 * this.PIXEL_SIZE || 
                    c <= this.GAME_FIELD.width - this.PIXEL_SIZE && c >= this.GAME_FIELD.width - this.PIXEL_SIZE - 20 * this.PIXEL_SIZE
                ) {
                    row.push(1);
                } else {
                    row.push(0)
                }
                
            }
    
            this.GAME_FIELD_MATRIX.push(row);
        }

        this.GAME_FIELD_MATRIX_WIDTH = this.GAME_FIELD_MATRIX[0].length;
        this.GAME_FIELD_MATRIX_HEIGHT = this.GAME_FIELD_MATRIX.length;
        this.TANK_POSITION = { 
            X: this.GAME_FIELD_MATRIX_WIDTH / 2 - this.TANK_SIZE / 2,
            Y: this.GAME_FIELD_MATRIX_HEIGHT - this.TANK_SIZE - 30
        };

        for (let r = 0; r < this.GAME_FIELD_MATRIX_HEIGHT; r++) {
            for (let c = 0; c < this.GAME_FIELD_MATRIX_WIDTH; c++) {
                if (this.GAME_FIELD_MATRIX[r][c] === 1) {
                    this.drawPixel( 
                        c * this.PIXEL_SIZE, 
                        r * this.PIXEL_SIZE, 
                        this.COLORS[0]
                    );
                }
            }
        }
    }

    private drawPixel(x: number, y: number, color: string): void {
        this.GAME_FIELD_CTX.fillStyle = color;
        this.GAME_FIELD_CTX.fillRect(x, y, this.PIXEL_SIZE, this.PIXEL_SIZE);
    }

    private clearPixel(x: number, y: number): void {
        this.GAME_FIELD_CTX.clearRect(x, y, this.PIXEL_SIZE, this.PIXEL_SIZE);
    }

    private drawTank(): void {
        for (let r = 0; r < this.TANK_SIZE; r++) {
            for (let c = 0; c < this.TANK_SIZE; c++) {
                const row = this.TANK_POSITION.Y + r;
                const column = this.TANK_POSITION.X + c;
                this.GAME_FIELD_MATRIX[row][column] = TANK_MATRIX[this.TANK_DIRECTION][r][c];
                
                if (this.GAME_FIELD_MATRIX[row][column] === 1) {
                    this.drawPixel(column * this.PIXEL_SIZE, row * this.PIXEL_SIZE, this.COLORS[1]);
                }
            }
        }
    }

    private clearTank(): void {
        for (let r = this.TANK_POSITION.Y; r < this.TANK_POSITION.Y + this.TANK_SIZE; r++) {
            for (let c = this.TANK_POSITION.X; c < this.TANK_POSITION.X + this.TANK_SIZE; c++) {
                this.GAME_FIELD_MATRIX[r][c] = 0;
                this.clearPixel(c * this.PIXEL_SIZE, r * this.PIXEL_SIZE);
            }
        }
    }

    private moveTank(direction: "LEFT" | "TOP" | "RIGHT" | "BOTTOM"): void {
        this.clearTank();

        let moveIsAllowed = true;

        switch(direction) {
            case "LEFT":
                for (let i = 0; i <= this.TANK_SIZE; i++) {
                    if (this.GAME_FIELD_MATRIX[this.TANK_POSITION.Y + i][this.TANK_POSITION.X - this.PIXEL_SIZE] !== 0) {
                        moveIsAllowed = false;
                        break;
                    }
                }
                if (moveIsAllowed) this.TANK_POSITION.X -= this.PIXEL_SIZE;
                break;

            case "TOP":
                for (let i = 0; i <= this.TANK_SIZE; i++) {
                    if (this.GAME_FIELD_MATRIX[this.TANK_POSITION.Y - this.PIXEL_SIZE][this.TANK_POSITION.X + i] !== 0) {
                        moveIsAllowed = false;
                        break;
                    }
                }
                if (moveIsAllowed) this.TANK_POSITION.Y -= this.PIXEL_SIZE;
                break;

            case "RIGHT":
                for (let i = 0; i <= this.TANK_SIZE; i++) {
                    if (this.GAME_FIELD_MATRIX[this.TANK_POSITION.Y + i][this.TANK_POSITION.X + this.TANK_SIZE + this.PIXEL_SIZE] !== 0) {
                        moveIsAllowed = false;
                        break;
                    }
                }
                if (moveIsAllowed) this.TANK_POSITION.X += this.PIXEL_SIZE;
                break;

            case "BOTTOM":
                for (let i = 0; i <= this.TANK_SIZE; i++) {
                    if (this.GAME_FIELD_MATRIX[this.TANK_POSITION.Y + this.TANK_SIZE + 1][this.TANK_POSITION.X + i] !== 0) {
                        moveIsAllowed = false;
                        break;
                    }
                }
                if (moveIsAllowed) this.TANK_POSITION.Y += this.PIXEL_SIZE;
                break;
        }
        
        this.drawTank();
    }

    private turnTank(direction: "LEFT" | "TOP" | "RIGHT" | "BOTTOM"): void {
        this.clearTank();
        this.TANK_DIRECTION = direction;
        this.drawTank();
    }

    private shoot = (): void => {
        if (this.COOLDOWN) return;

        const SHELL_POSITION = { X: 0, Y: 0 };
        const SHELL_DIRECTION = this.TANK_DIRECTION;
        let shellTimerId = 0;
        let cooldownTimerId = 0;

        switch (SHELL_DIRECTION) {
            case "LEFT":
                SHELL_POSITION.X = this.TANK_POSITION.X - 2;
                SHELL_POSITION.Y = this.TANK_POSITION.Y + this.TANK_SIZE / 2 - 1;
                break;
                
            case "TOP":
                SHELL_POSITION.X = this.TANK_POSITION.X + this.TANK_SIZE / 2 - 1;
                SHELL_POSITION.Y = this.TANK_POSITION.Y - 2;
                break;

            case "RIGHT":
                SHELL_POSITION.X = this.TANK_POSITION.X + this.TANK_SIZE;
                SHELL_POSITION.Y = this.TANK_POSITION.Y + this.TANK_SIZE / 2 - 1;
                break;
                
            case "BOTTOM":
                SHELL_POSITION.X = this.TANK_POSITION.X + this.TANK_SIZE / 2 - 1;
                SHELL_POSITION.Y = this.TANK_POSITION.Y + this.TANK_SIZE;
                break;
        }

        if (
            this.GAME_FIELD_MATRIX[SHELL_POSITION.Y][SHELL_POSITION.X] !== 0 ||
            this.GAME_FIELD_MATRIX[SHELL_POSITION.Y + 1][SHELL_POSITION.X] !== 0 ||
            this.GAME_FIELD_MATRIX[SHELL_POSITION.Y][SHELL_POSITION.X + 1] !== 0 ||
            this.GAME_FIELD_MATRIX[SHELL_POSITION.Y + 1][SHELL_POSITION.X + 1] !== 0
        ) {
            return;
        }

        const clearShell = (): void => {
            for (let r = SHELL_POSITION.Y; r < SHELL_POSITION.Y + 2; r++) {
                for (let c = SHELL_POSITION.X; c < SHELL_POSITION.X + 2; c++) {
                    this.GAME_FIELD_MATRIX[r][c] = 0;
                    this.clearPixel(c * this.PIXEL_SIZE, r * this.PIXEL_SIZE);
                }
            }
        }

        const moveShell = (): void => {
            if (
                SHELL_DIRECTION === "LEFT" && this.GAME_FIELD_MATRIX[SHELL_POSITION.Y][SHELL_POSITION.X - 1] === 1 ||
                SHELL_DIRECTION === "TOP" && this.GAME_FIELD_MATRIX[SHELL_POSITION.Y - 1][SHELL_POSITION.X] === 1 ||
                SHELL_DIRECTION === "RIGHT" && this.GAME_FIELD_MATRIX[SHELL_POSITION.Y][SHELL_POSITION.X + 2] === 1 ||
                SHELL_DIRECTION === "BOTTOM" && this.GAME_FIELD_MATRIX[SHELL_POSITION.Y + 2][SHELL_POSITION.X] === 1
            ) {
                clearShell();
                clearInterval(shellTimerId);
                shellTimerId = 0;
                return;
            }
            
            clearShell();

            switch(SHELL_DIRECTION) {
                case "LEFT":
                    SHELL_POSITION.X -= 1;
                    break;
    
                case "TOP":
                    SHELL_POSITION.Y -= 1;
                    break;
    
                case "RIGHT":
                    SHELL_POSITION.X += 1;
                    break;
    
                case "BOTTOM":
                    SHELL_POSITION.Y += 1;
                    break;
            }

            for (let r = SHELL_POSITION.Y; r < SHELL_POSITION.Y + 2; r++) {
                for (let c = SHELL_POSITION.X; c < SHELL_POSITION.X + 2; c++) {
                    this.GAME_FIELD_MATRIX[r][c] = 1;
                    this.drawPixel(
                        c * this.PIXEL_SIZE, 
                        r * this.PIXEL_SIZE, 
                        this.COLORS[2]
                    );
                }
            }
        }

        shellTimerId = setInterval(moveShell, 10);
        this.COOLDOWN = true;
        cooldownTimerId = setTimeout(() => {
            this.COOLDOWN = false;
            clearTimeout(cooldownTimerId);
            cooldownTimerId = 0;
        }, 1000);
    }

    private keyHandler = (e: KeyboardEvent): void => {
        switch(e.key) {
            case "a":
                if (this.TANK_DIRECTION === "LEFT") {
                    this.moveTank("LEFT");
                } else {
                    this.turnTank("LEFT");
                }
                break;

            case "w":
                if (this.TANK_DIRECTION === "TOP") {
                    this.moveTank("TOP");
                } else {
                    this.turnTank("TOP");
                }
                break;

            case "d":
                if (this.TANK_DIRECTION === "RIGHT") {
                    this.moveTank("RIGHT");
                } else {
                    this.turnTank("RIGHT");
                }
                break;

            case "s":
                if (this.TANK_DIRECTION === "BOTTOM") {
                    this.moveTank("BOTTOM");
                } else {
                    this.turnTank("BOTTOM");
                }
                break;

            case "p":
                this.shoot();
                break;
        }
    }
}
