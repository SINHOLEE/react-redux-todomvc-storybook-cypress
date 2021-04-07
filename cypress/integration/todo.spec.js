const todos = [
  {
    id: 1,
    text: 'Have Breakfast',
    completed: true
  },
  {
    id: 2,
    text: 'Have Lunch',
    completed: false
  }
];

const getOptions = (url = '/todos') => {
  const options = {
    url,
    delay: 500,
    response: todos
  };
  return options;
};

beforeEach(() => {
  cy.server();
  cy.route(getOptions()).as('getTodos');

  cy.route(getOptions('/All')).as('All');
  cy.route(getOptions('/Completed')).as('Completed');

  cy.visit('/');
});

describe('should render todo items', () => {
  it('todos를 불러오는 동안 로딩창이 뜬다.', () => {
    cy.get('[data-testid=todos-loading]').should('visible');

    cy.wait('@getTodos').then(() => {
      cy.get('[data-testid=todos-loading]').should('not.be.visible');
    });
  });

  it('All', () => {
    cy.get('[data-testid=All]').click();

    cy.get('[data-testid=todo-item').within(items => {
      expect(items).to.have.length(2);
      expect(items[0]).to.contain('Have Breakfast');
      expect(items[0]).to.have.class('completed');

      expect(items[1]).to.contain('Have Lunch');
      expect(items[1]).not.to.have.class('completed');
    });
  });
  it('All click', () => {
    cy.get('[data-testid=todo-item').within(items => {
      expect(items).to.have.length(2);
      expect(items[0]).to.contain('Have Breakfast');
      expect(items[0]).to.have.class('completed');

      expect(items[1]).to.contain('Have Lunch');
      expect(items[1]).not.to.have.class('completed');
    });
  });
  it('Active', () => {
    cy.get('[data-testid="Active"]').click();
    // cy.visit('/Active');

    cy.get('[data-testid=todo-item').within(items => {
      expect(items).to.have.length(1);

      expect(items[0]).to.contain('Have Lunch');
      expect(items[0]).not.to.have.class('completed');
    });
  });

  it('Completed', () => {
    cy.visit('/Completed');

    cy.get('[data-testid=todo-item').within(items => {
      expect(items).to.have.length(1);

      expect(items[0]).to.contain('Have Breakfast');
      expect(items[0]).to.have.class('completed');
    });
  });

  it('Add Todo', () => {
    cy.wait('@getTodos').then(() => {
      const reqStub = cy.stub();
      expect(reqStub).to.be(1);
      cy.route({ method: 'PUT', url: '/todos', onRequest: reqStub }).as('sync');

      cy.get('[data-testid="todo-input"]').type('Have a Coffee{enter}');

      cy.get('[data-testid="todo-item"]').within(items => {
        expect(items).to.have.length(3);

        expect(items[2]).to.contain('Have a Coffee');
        expect(items[2]).not.to.have.class('completed');
      });

      cy.wait('@sync').then(() => {
        expect(reqStub.args[0][0].request.body).to.eql([
          ...todos,
          {
            id: 3,
            text: 'Have a Coffee',
            completed: false
          }
        ]);
      });
    });
  });
});
