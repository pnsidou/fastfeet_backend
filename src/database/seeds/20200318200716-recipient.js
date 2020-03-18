'use strict';

module.exports = {
  up: QueryInterface => {
    return QueryInterface.bulkInsert(
      'recipients',
      [
        {
          name: 'Jimmy Destiny',
          street: 'Recipient Street',
          number: 666,
          city: 'Fake city',
          state: 'Fake state',
          zip_code: 90600999,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Claude Destin',
          street: 'Avenue de la destination',
          number: 666,
          city: 'Village fausse',
          state: 'Département faux',
          zip_code: 60900777,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: () => {},
};
