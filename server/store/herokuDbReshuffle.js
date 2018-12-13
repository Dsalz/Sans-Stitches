import dbTables from './initTables';

dbTables.drop()
  .then(() => dbTables.create())
  .then(() => dbTables.addAdminUser());
