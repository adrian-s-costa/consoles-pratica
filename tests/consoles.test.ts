import supertest from "supertest";
import app from "app";
import prisma from "config/database";
import { createConsoleData, createGame } from "./factories/console-factory";

const api = supertest(app);

beforeAll(async ()=>{
    await prisma.console.deleteMany({});
    await prisma.game.deleteMany({});
});

describe("GET /consoles", ()=>{
    it('should return status 200 and array of consoles', async ()=>{
        const consoles = await api.get('/consoles');
        expect(consoles.statusCode).toBe(200);
        expect(consoles.body).toEqual([]);
    })
})

describe("GET /consoles/:id", ()=>{
    it('should return status 200 and array of consoles', async ()=>{
        const consoleReq = await createConsoleData();
        const req = await api.post('/consoles').send(consoleReq);
        const consolesArr = await api.get(`/consoles`);
        const consoles = await api.get(`/consoles/${consolesArr.body[0].id}`);
        expect(req.statusCode).toBe(201);
        expect(consoles.body).toEqual({
            id: expect.any(Number),
            name: consoles.body.name
        });
    })
})

describe("GET /consoles/:id", ()=>{
    it('should return status 404 if there is no object with the id given', async ()=>{
        const consoles = await api.get(`/consoles/1`);
        expect(consoles.statusCode).toBe(404);
    })
})

describe('POST /consoles', ()=>{
    it('should return status 201 and the console object inserted on db', async ()=>{
        const console = await createConsoleData();
        const req = await api.post('/consoles').send(console)
        const consoleConsulta = await prisma.console.findFirst({
            where:{
                name: console.name 
            }
        })
        
        expect(req.statusCode).toBe(201)
        expect(consoleConsulta).toEqual({
            id: expect.any(Number),
            name: console.name
        });
    });
});

describe('POST /game', ()=>{
    it('should return status 201 and create a game object on db', async ()=>{
        const console = await createConsoleData();
        await api.post('/consoles').send(console);
        const consoleConsulta = await prisma.console.findFirst({
            where:{
                name: console.name
            }
        });
        const game = await createGame(consoleConsulta.id)
        const reqGame = await api.post('/games').send(game);
        const gameConsulta = await prisma.game.findFirst({
            where:{
                title: game.title
            }
        });

        expect(reqGame.statusCode).toBe(201)
        expect(gameConsulta).toEqual({
            id: expect.any(Number),
            title: game.title,
            consoleId: consoleConsulta.id
        });
    });
});

describe("GET /games/:id", ()=>{
    it('should return status 404 if there is no object with the id given', async ()=>{
        const consoles = await api.get(`/games/1`);
        expect(consoles.statusCode).toBe(404);
    });
});