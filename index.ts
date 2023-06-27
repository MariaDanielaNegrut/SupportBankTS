/*
Part 1.

- program that creates account, creates transactions
- classes for objects
- 2 commands typed in console - list all (transactions) and list account

 */

import {Moment} from "moment";
import * as fs from "fs";
import {parse} from "csv-parse/sync";
const moment = require('moment');
const readlineSync = require('readline-sync');

class Account {
    private _name: string;
    private _amount: number;

    constructor(name: string, amount: number) {
        this._name = name;
        this._amount = amount;
    }

    get name() {
        return this._name;
    }

    get amount() {
        return this._amount;
    }

    set name(name: string) {
        this._name = name;
    }

    set amount(amount: number) {
        this._amount = amount;
    }
}

class Transaction {
    from: string;
    to: string;
    amount: number;
    narrative: string;
    date: Moment;

    constructor(from: string, to: string, amount: number, narrative: string, date: Moment) {
        this.amount = amount;
        this.from = from;
        this.to = to;
        this.narrative = narrative;
        this.date = date;
    }
}

let transactions: Transaction[] = [];

function parseCSVFile(filePath: string): Transaction[] {
    try {
        const stream = fs.readFileSync(filePath, 'utf-8');

        transactions = parse(stream, {delimiter: ",", columns: true}).map(
            (element: {From: string, To: string, Amount: string, Narrative: string, Date: string}) => {
                return new Transaction(
                    element.From,
                    element.To,
                    Number(element.Amount),
                    element.Narrative,
                    moment(element.Date, "DD/MM/YYYY"));
            }
        );

    } catch (error) {
        console.log(`An error occurred when reading from file ${filePath}.`)
    }

    return [];
}

function getUserInput(prompt: string) {
    return readlineSync.question(prompt);
}

function userInterface() {
    let flag: boolean = false;
    while (!flag) {
        let response = getUserInput("List All / List <Name> / EXIT\n");
        if (response.toLowerCase() === "list all") {
            console.log(transactions);
        } else if (response.toLowerCase().startsWith("list ")) {
            let name = response.toLowerCase().split("list ")[1];
            console.log(transactions.filter((item) => {
                return item.to.toLowerCase() === name || item.from.toLowerCase() === name
            }))
        }
        if (response.toLowerCase() === "exit") {
            flag = true;
        }
    }
}

parseCSVFile("C:\\Work\\Bootcamp\\SupportBankTS\\Transactions2014.csv");

userInterface();