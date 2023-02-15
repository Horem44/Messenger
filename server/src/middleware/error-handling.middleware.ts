import { Request, Response, NextFunction } from 'express';
import { Error } from '../models';

export const errorHandler = (err: TypeError|Error, req:Request, res:Response, next:NextFunction) => {
    let error = err;

    if (!(err instanceof Error)) {
        error = new Error(
            'Internal server error!'
        );
    }

    return res.status((error as Error).status).json({error});
}

