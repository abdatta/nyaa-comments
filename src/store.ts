import { createConnection, Connection } from 'mongoose';

export class Store {

    public connection: Connection;

    constructor() {
        const dbaddr: string = process.env.DB_ADDR || 'localhost';
        const dbport: string = process.env.DB_PORT || '27017';
        const dbname: string = process.env.DB_NAME || 'nyaa_scraper';
        const dbuser: string = process.env.DB_USER || '';
        const dbpass: string = process.env.DB_PASS || '';
        const MONGODB_CONNECTION = `mongodb://${dbuser}:${dbpass}@${dbaddr}:${dbport}/${dbname}?authSource=admin`;

        this.connection = createConnection(MONGODB_CONNECTION, {
            useNewUrlParser: true,
            useFindAndModify: false,
            useCreateIndex: true,
            useUnifiedTopology: true
        });
    }
}
