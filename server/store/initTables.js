import db from './db';
import queries from './queries';

const testEmails = ['jackieboy@yahoo.com', 'jackiechanizzle@yahoo.com', 'damo@yahoo.com',
  'moses@yahoo.com', 'duplicationtestemail@yahoo.com', 'mainaki@yahoo.com'];


const dbTables = {
  deleteTestEmails: () => Promise.all(
    testEmails.map(email => db.sendQuery(queries.deleteUserByEmailQuery(), [email])),
  ).then(() => dbTables.addAdminUser()),
  addAdminUser: () => db.sendQuery(queries.addAdminQuery(), [
    'admin@yahoo.com', 'admin', 'boss', 'olowo',
    'baddestadmineverliveth', '0908345768943', new Date(),
    'admin@yahoo.com']).then(resp => Promise.resolve(resp)),
};

dbTables.deleteTestEmails();
