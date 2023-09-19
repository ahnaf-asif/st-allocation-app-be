#### Installation Process

* Create a `.env` file and specify environmental values. Use postgresql as the database. (there is a .env.example file attached to help you)

* Create a `.env.test` file and put all environmental values other than DB_URL. Create a new test database and put its credentials instead of the real database.

* Run `yarn install`

* Run `yarn prisma:generate`

* Run `yarn prisma:migrate-dev`

* Run `yarn start:dev`

#### Testing

* Run this first: `yarn pretest:e2e` . It will create and scaffold the test database

* Run `yarn test:e2e` to test the files.

* Run `test:cov-e2e` to generate the test coverage.

#### Extra

* Run `node-pre-gyp rebuild -C ./node_modules/argon2` if you are having problems with argon2 in mac m1/m2

