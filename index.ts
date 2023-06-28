import {Moment} from "moment";
import * as fs from "fs";
import {parse} from "csv-parse/sync";
const moment = require('moment');
const readlineSync = require('readline-sync');

class Account {
    private _name: string;
    private _balance: number;
    private _transactions: Transaction[] = [];

    constructor(name: string, amount: number) {
        this._name = name;
        this._balance = amount;
    }

    addTransaction(transaction: Transaction) {
        this._transactions.push(transaction);
    }

    toString() {
        return `Name: ${this._name} | Balance: ${this.balance}\n`;
    }

    transactionsString() {
        const array = this._transactions.map((transaction: Transaction) => {
            return `${transaction.date.format("DD/MM/YYYY")}|TO: ${transaction.to}|FROM: ${transaction.from}|`+
              `AMOUNT: ${transaction.amount.toString()}|${transaction.narrative}`;
        })

        return array.join("\n");
    }

    get transactions () {
        return this._transactions;
    }

    get name() {
        return this._name;
    }

    get balance() {
        return this._balance;
    }

    set transactions (transactions: Transaction[]) {
        this._transactions = transactions;
    }

    set name(name: string) {
        this._name = name;
    }

    set balance(amount: number) {
        this._balance = amount;
    }
}

class Transaction {
    private _from: string;
    private _to: string;
    private _amount: number;
    private _narrative: string;
    private _date: Moment;

    constructor(from: string, to: string, amount: number, narrative: string, date: Moment) {
        this._amount = amount;
        this._from = from;
        this._to = to;
        this._narrative = narrative;
        this._date = date;
    }

    get from () {
        return this._from;
    }

    get to () {
        return this._to;
    }


    get narrative() {
        return this._narrative;
    }

    get amount() {
        return this._amount;
    }

    get date() {
        return this._date;
    }

    set from(from: string) {
        this._from = from;
    }

    set to (to: string) {
        this._to = to;
    }

    set narrative (narrative: string) {
        this._narrative = narrative;
    }

    set date (date: Moment) {
        this._date = date;
    }
}

let accounts: Account[] = [];

function parseCSVFile(filePath: string): void {
    try {
        const stream = fs.readFileSync(filePath, 'utf-8');

        parse(stream, {delimiter: ",", columns: true}).forEach(
            (element: {From: string, To: string, Amount: string, Narrative: string, Date: string}) => {
                const uniqueNames: string[] = accounts.map((item:Account) => item.name)
                    .filter((value, index, self) => self.indexOf(value) === index);


                if (uniqueNames.find(name => name === element.From) === undefined) {
                    accounts.push(new Account(
                        element.From,
                        0
                    ));
                }

                if (uniqueNames.find(name => name === element.To) === undefined) {
                    accounts.push(new Account(
                        element.To,
                        0
                    ));
                }

                accounts.forEach((account: Account) => {
                    if (account.name === element.From) {
                        account.balance -= Number(element.Amount);
                        account.addTransaction(new Transaction(
                            element.From,
                            element.To,
                            Number(element.Amount),
                            element.Narrative,
                            moment(element.Date, "DD/MM/YYYY")));
                    } else if (account.name === element.To) {
                        account.balance += Number(element.Amount);
                        account.addTransaction(new Transaction(
                            element.From,
                            element.To,
                            Number(element.Amount),
                            element.Narrative,
                            moment(element.Date, "DD/MM/YYYY")));
                    }
                })
            }
        );


    } catch (error) {
        console.log(`An error occurred when reading from file ${filePath}.`)
    }
}

function getUserInput(prompt: string) {
    return readlineSync.question(prompt);
}

function userInterface() {
    let flag: boolean = false;

    while (!flag) {
        let response = getUserInput("List All / List <Name> / EXIT\n");

        if (response.toLowerCase() === "list all") {
            accounts.forEach((account: Account) => {
                console.log(account.toString());
            })
        } else if (response.toLowerCase().startsWith("list ")) {
            let name = response.toLowerCase().split("list ")[1];
            let account = accounts.find((item) => {
                return item.name.toLowerCase() === name
            });

            if (account !== undefined) {
                console.log(account.transactionsString());
            } else {
                console.log("Account doesnt exist.");
            }
        }

        if (response.toLowerCase() === "exit") {
            flag = true;
        }
    }
}

parseCSVFile("C:\\Work\\Bootcamp\\SupportBankTS\\Transactions2014.csv");
userInterface();