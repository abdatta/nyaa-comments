import express, { Handler, json } from 'express';
import { Repository } from './repository';

export class Server {
    private server = express();

    constructor(private repository: Repository) {
        this.server.use(json());
        this.server.get('/api/comments', this.fetchCommentsList);
    }

    start(port = parseInt(process.env.HTTP_PORT!) || 3000): Promise<void> {
        return new Promise(resolve => this.server.listen(port, () => {
            console.log('Server started listening on port:', port);
            resolve();
        }));
    }

    fetchCommentsList: Handler = (req, res) => {
        const nyaaId = req.query.nyaaId as string;
        this.repository.fetchComments(nyaaId)
            .then(comments => res.send(comments))
            .catch(err => res.status(500).send(err))
    }
}