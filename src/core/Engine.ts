import { TANK_MATRIX } from '../models/Tank';

export default class Engine {
    private GAME_FIELD: HTMLCanvasElement;
    private GAME_FIELD_WIDTH = 960;
    private GAME_FIELD_HEIGHT = 480;
    private GAME_FIELD_MATRIX: number[][] = [];
    private GAME_FIELD_MATRIX_WIDTH = 0;
    private GAME_FIELD_MATRIX_HEIGHT = 0;
    private CELL_SIZE = 2;
    private TANK_SIZE = 12;
    private TANK_POSITION = { X: 0, Y: 0 };
    private TANK_DIRECTION: "LEFT" | "TOP" | "RIGHT" | "BOTTOM" = "TOP";

    private timers = {
        SHELL: 0
    }

    private colors = {
        basic: "#080"
    };

    constructor() {
        this.GAME_FIELD = <HTMLCanvasElement>document.getElementById("game_field");
        this.GAME_FIELD.width = this.GAME_FIELD_WIDTH;
        this.GAME_FIELD.height = this.GAME_FIELD_HEIGHT;
    
        for (let r = 0; r < this.GAME_FIELD.height; r += this.CELL_SIZE) {
            let row = [];
    
            for (let c = 0; c < this.GAME_FIELD.width; c += this.CELL_SIZE) {
                row.push(0);
            }
    
            this.GAME_FIELD_MATRIX.push(row);
        }

        this.GAME_FIELD_MATRIX_WIDTH = this.GAME_FIELD_MATRIX[0].length;
        this.GAME_FIELD_MATRIX_HEIGHT = this.GAME_FIELD_MATRIX.length;
        this.TANK_POSITION = { 
            X: this.GAME_FIELD_MATRIX_WIDTH / 2 - this.TANK_SIZE / 2,
            Y: this.GAME_FIELD_MATRIX_HEIGHT / 2 - this.TANK_SIZE / 2
        };

        this.drawTank();

        window.addEventListener("keydown", this.keyHandler);
    }

    private drawRect(ctx: CanvasRenderingContext2D, x: number, y: number, color:string): void {
        ctx.fillStyle = color;
        ctx.fillRect(x, y, this.CELL_SIZE, this.CELL_SIZE);
    }

    private drawTank(): void {
        for (let r = 0; r < this.TANK_SIZE; r++) {
            for (let c = 0; c < this.TANK_SIZE; c++) {
                this.GAME_FIELD_MATRIX[r + this.TANK_POSITION.Y][c + this.TANK_POSITION.X] = TANK_MATRIX[this.TANK_DIRECTION][r][c];
            }
        }

        this.render();
    }

    private clearTank(): void {
        for (let r = this.TANK_POSITION.Y; r < this.TANK_POSITION.Y + this.TANK_SIZE; r++) {
            for (let c = this.TANK_POSITION.X; c < this.TANK_POSITION.X + this.TANK_SIZE; c++) {
                this.GAME_FIELD_MATRIX[r][c] = 0;
            }
        }

        this.render();
    }

    private moveTank(direction: "LEFT" | "TOP" | "RIGHT" | "BOTTOM"): void {
        this.TANK_DIRECTION = direction;

        switch(direction) {
            case "LEFT":
                if (this.TANK_POSITION.X > 0) {
                    this.TANK_POSITION.X -= this.CELL_SIZE;
                }
                break; 
            case "TOP":
                if (this.TANK_POSITION.Y > 0) {
                    this.TANK_POSITION.Y -= this.CELL_SIZE;
                }
                break;
            case "RIGHT":
                if (this.TANK_POSITION.X + this.TANK_SIZE < this.GAME_FIELD_MATRIX_WIDTH) {
                    this.TANK_POSITION.X += this.CELL_SIZE;
                }
                break; 
            case "BOTTOM":
                if (this.TANK_POSITION.Y  + this.TANK_SIZE < this.GAME_FIELD_MATRIX_HEIGHT) {
                    this.TANK_POSITION.Y += this.CELL_SIZE;
                }
                break;
        }

        this.drawTank();
    }

    private keyHandler = (e: KeyboardEvent) => {
        this.clearTank();

        switch(e.key) {
            case "a":
                this.moveTank("LEFT");
                break; 
            case "w":
                this.moveTank("TOP");
                break;
            case "d":
                this.moveTank("RIGHT");
                break; 
            case "s":
                this.moveTank("BOTTOM");
                break;
        }
    }

    private render = () => {
        const ctx = <CanvasRenderingContext2D>this.GAME_FIELD.getContext("2d");
        ctx.clearRect(0, 0, this.GAME_FIELD_MATRIX_WIDTH * this.CELL_SIZE, this.GAME_FIELD_MATRIX_HEIGHT * this.CELL_SIZE);

        for (let r = 0; r < this.GAME_FIELD_MATRIX_HEIGHT; r++) {
            for (let c = 0; c < this.GAME_FIELD_MATRIX_WIDTH; c++) {
                if (this.GAME_FIELD_MATRIX[r][c] === 1) {
                    this.drawRect(ctx, c * this.CELL_SIZE, r * this.CELL_SIZE, this.colors.basic);
                }
            }
        }
    }
}
