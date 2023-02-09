import prisma from "config/database";
import { faker } from "@faker-js/faker";

export async function createConsole(){
    return await prisma.console.create({
        data:{
            name: faker.company.name()
        }
    })
}

export async function createConsoleData(){
    return {
        name: faker.company.name()
    }
}

export async function createGame(idConsole: number){
    return{
        title: faker.company.name(),
        consoleId: idConsole
    }
}