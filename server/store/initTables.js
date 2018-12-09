import db from './db';
import queries from './queries';

const dbTables = {
  create: () => new Promise((resolve, reject) => {
    db.sendQuery(queries.createRecordsTableQuery())
      .then(() => db.sendQuery(queries.createUsersTableQuery()))
      .then(resp => resolve(resp))
      .catch(err => reject(err));
  }),
  drop: () => new Promise((resolve, reject) => {
    db.sendQuery(queries.dropRecordsTableQuery())
      .then(() => db.sendQuery(queries.dropUsersTableQuery()))
      .then(resp => resolve(resp))
      .catch(err => reject(err));
  }),
};

dbTables.drop()
  .then(() => dbTables.create());
