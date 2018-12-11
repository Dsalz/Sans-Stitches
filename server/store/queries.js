export default {
  createUsersTableQuery: () => `CREATE TABLE IF NOT EXISTS
  users(
    id SERIAL PRIMARY KEY,
    email VARCHAR(128) NOT NULL,
    firstname VARCHAR(128) NOT NULL,
    lastname VARCHAR(128),
    othername VARCHAR(128),
    password VARCHAR(128) NOT NULL,
    is_admin BOOL,
    phone_number VARCHAR(128),
    registered TIMESTAMP,
    username VARCHAR(128)
    )`,

  dropUsersTableQuery: () => 'DROP TABLE IF EXISTS users',

  createRecordsTableQuery: () => `CREATE TABLE IF NOT EXISTS
  records(
    id SERIAL PRIMARY KEY,
    comment VARCHAR(128) NOT NULL,
    description VARCHAR(128),
    type VARCHAR(128),
    created_on TIMESTAMP,
    created_by INT NOT NULL,
    location VARCHAR(128),
    is_active BOOL,
    status VARCHAR(128),
    feedback VARCHAR(128),
    Images VARCHAR(128)[],
    Videos VARCHAR(128)[]
    )`,

  dropRecordsTableQuery: () => 'DROP TABLE IF EXISTS records',

  getUserByEmailAndPasswordQuery: () => `SELECT * from users 
  WHERE email=$1 and password=$2`,

  getUserByEmailQuery: () => `SELECT * from users 
  WHERE email=$1`,

  deleteUserByEmailQuery: () => 'DELETE from users WHERE email=$1',

  addNonAdminQuery: () => `INSERT INTO 
  users(email,firstname,lastname,othername,password,phone_number,registered,username,is_admin)
  VALUES($1,$2,$3,$4,$5,$6,$7,$8,false)
  returning *`,

  addAdminQuery: () => `INSERT INTO 
  users(email,firstname,lastname,othername,password,phone_number,registered,username,is_admin)
  VALUES($1,$2,$3,$4,$5,$6,$7,$8,true)
  returning *`,

  getAllRecordsByTypeQuery: () => `SELECT * from records 
  WHERE is_active=true and type=$1`,

  getRecordByIdQuery: () => `SELECT * from records 
  WHERE id=$1`,

  addRecordQuery: () => `INSERT INTO 
  records(comment,description,created_on,created_by,type,location,status,feedback,Images,Videos,is_active)
  VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,true)
  returning *`,

  updateRecordQuery: () => `UPDATE records 
  SET comment=$2,description=$3,location=$4,status=$5,feedback=$6,Images=$7,Videos=$8 
  WHERE id=$1 
  returning *`,

  deleteRecordQuery: () => `UPDATE records 
  SET is_active=false 
  WHERE id=$1 
  returning *`,
};
