import db from './db';
import queries from './queries';

const testEmails = ['jackieboy@yahoo.com', 'jackiechanizzle@yahoo.com', 'damo@yahoo.com',
  'moses@yahoo.com', 'duplicationtestemail@yahoo.com', 'mainaki@yahoo.com'];


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
  deleteTestEmails: () => Promise.all(
    testEmails.map(email => db.sendQuery(queries.deleteUserByEmailQuery(), [email])),
  ).then(() => Promise.resolve()),
  addAdminUser: () => db.sendQuery(queries.addAdminQuery(), [
    'admin@yahoo.com', 'admin', 'boss', 'olowo',
    'baddestadmineverliveth', '0908345768943', new Date(),
    'admin@yahoo.com']).then(resp => Promise.resolve(resp)),
};

export default dbTables;
