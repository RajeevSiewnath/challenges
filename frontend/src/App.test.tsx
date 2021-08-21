import React from 'react';
import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import {createMemoryHistory} from 'history'
import App from './App';
import {Router} from 'react-router-dom';
import {rest} from 'msw';
import {setupServer} from 'msw/node';
import {Consent, ConsentType} from "./types";

expect.extend({
    toContainObject(received, argument) {
        const pass = this.equals(received,
            expect.arrayContaining([
                expect.objectContaining(argument)
            ])
        );
        if (pass) {
            return {
                message: () => (`expected ${this.utils.printReceived(received)} not to contain object ${this.utils.printExpected(argument)}`),
                pass: true,
            };
        } else {
            return {
                message: () => (`expected ${this.utils.printReceived(received)} to contain object ${this.utils.printExpected(argument)}`),
                pass: false,
            };
        }
    },
})

let data: Array<Consent> = [];

const server = setupServer(
    rest.get('http://localhost:8080/consents', (req, res, ctx) => {
        return res(ctx.delay(100), ctx.json(data));
    }),
    rest.post('http://localhost:8080/consents', (req, res, ctx) => {
        data.push(req.body as Consent);
        return res(ctx.delay(100), ctx.json(data));
    }),
)

beforeAll(() => server.listen())
beforeEach(() => {
    data = [];
});
afterEach(() => server.resetHandlers())
afterAll(() => server.close())


test('renders give homepage redirect', () => {
    const history = createMemoryHistory();
    const dom = render(<Router history={history}><App/></Router>);
    expect(dom.container.querySelector('#give-consents')).toBeInTheDocument();
});

test('renders give consent screen', () => {
    const history = createMemoryHistory();
    const dom = render(<Router history={history}><App/></Router>);
    history.push('/give-consent');
    expect(dom.container.querySelector('#give-consents')).toBeInTheDocument();
});

test('renders give consents screen', () => {
    const history = createMemoryHistory();
    const dom = render(<Router history={history}><App/></Router>);
    history.push('/consents');
    expect(dom.container.querySelector('#consents')).toBeInTheDocument();
});

test('renders give error screen', () => {
    const history = createMemoryHistory();
    render(<Router history={history}><App/></Router>);
    history.push('/not-found');
    expect(screen.getByText("Error: Page not found")).toBeInTheDocument();
});

test('renders enter consent', async () => {
    const history = createMemoryHistory();
    const dom = render(<Router history={history}><App/></Router>);
    history.push('/give-consent');
    const nameInput = screen.getByPlaceholderText("Name") as HTMLInputElement;
    expect(nameInput).toBeInTheDocument();
    const emailInput = screen.getByPlaceholderText("Email");
    expect(emailInput).toBeInTheDocument();
    const consentsTypes = dom.container.querySelectorAll('input[type=checkbox]');
    expect(consentsTypes.length).toBe(3);
    consentsTypes.forEach(consentType => expect(consentType).toBeInTheDocument());
    const button = dom.container.querySelector("button");
    expect(button).toBeInTheDocument();

    userEvent.type(nameInput, "test");
    userEvent.type(emailInput, "test@test.com");
    userEvent.click(consentsTypes[0]);
    userEvent.click(consentsTypes[1]);
    userEvent.click(consentsTypes[2]);
    userEvent.click(button!);

    await waitFor(() => expect(nameInput.value).toBe(''));

    (expect(data) as any).toContainObject({name: 'test', email: 'test@test.com'});
});

test('renders enter consent error', async () => {
    const history = createMemoryHistory();
    const dom = render(<Router history={history}><App/></Router>);
    history.push('/give-consent');
    const nameInput = screen.getByPlaceholderText("Name") as HTMLInputElement;
    expect(nameInput).toBeInTheDocument();
    const emailInput = screen.getByPlaceholderText("Email");
    expect(emailInput).toBeInTheDocument();
    const consentsTypes = dom.container.querySelectorAll('input[type=checkbox]');
    expect(consentsTypes.length).toBe(3);
    consentsTypes.forEach(consentType => expect(consentType).toBeInTheDocument());
    const button = dom.container.querySelector("button");
    expect(button).toBeInTheDocument();

    userEvent.type(nameInput, "test");
    userEvent.type(emailInput, "no_email");
    userEvent.click(consentsTypes[0]);
    userEvent.click(consentsTypes[1]);
    userEvent.click(consentsTypes[2]);
    userEvent.click(button!);

    await waitFor(() => expect(screen.getByText("Invalid email address")).toBeInTheDocument());
});

test('renders enter consent name error', async () => {
    const history = createMemoryHistory();
    const dom = render(<Router history={history}><App/></Router>);
    history.push('/give-consent');
    const nameInput = screen.getByPlaceholderText("Name") as HTMLInputElement;
    expect(nameInput).toBeInTheDocument();
    const emailInput = screen.getByPlaceholderText("Email");
    expect(emailInput).toBeInTheDocument();
    const consentsTypes = dom.container.querySelectorAll('input[type=checkbox]');
    expect(consentsTypes.length).toBe(3);
    consentsTypes.forEach(consentType => expect(consentType).toBeInTheDocument());
    const button = dom.container.querySelector("button");
    expect(button).toBeInTheDocument();

    userEvent.type(nameInput, "");
    userEvent.type(emailInput, "test@test.com");
    userEvent.click(consentsTypes[0]);
    userEvent.click(consentsTypes[1]);
    userEvent.click(consentsTypes[2]);
    userEvent.click(button!);

    await waitFor(() => expect(screen.getByText("Required")).toBeInTheDocument());
});

test('renders enter consent types error', async () => {
    const history = createMemoryHistory();
    const dom = render(<Router history={history}><App/></Router>);
    history.push('/give-consent');
    const nameInput = screen.getByPlaceholderText("Name") as HTMLInputElement;
    expect(nameInput).toBeInTheDocument();
    const emailInput = screen.getByPlaceholderText("Email");
    expect(emailInput).toBeInTheDocument();
    const consentsTypes = dom.container.querySelectorAll('input[type=checkbox]');
    expect(consentsTypes.length).toBe(3);
    consentsTypes.forEach(consentType => expect(consentType).toBeInTheDocument());
    const button = dom.container.querySelector("button");
    expect(button).toBeInTheDocument();

    userEvent.type(nameInput, "");
    userEvent.type(emailInput, "test@test.com");
    userEvent.click(button!);

    await waitFor(() => expect(screen.getByText("Required at least 1")).toBeInTheDocument());
});

test('renders consents and paging', async () => {
    data.push({
        "name": "test1",
        "email": "test1@test.com",
        "consents": [
            ConsentType.NEWSLETTER,
            ConsentType.TARGETED_ADS,
            ConsentType.VISIT_STATS
        ]
    }, {
        "name": "test2",
        "email": "test2@test.com",
        "consents": [
            ConsentType.NEWSLETTER,
            ConsentType.TARGETED_ADS,
            ConsentType.VISIT_STATS
        ]
    }, {
        "name": "test3",
        "email": "test3@test.com",
        "consents": [
            ConsentType.NEWSLETTER,
            ConsentType.TARGETED_ADS,
            ConsentType.VISIT_STATS
        ]
    })
    const history = createMemoryHistory();
    render(<Router history={history}><App/></Router>);
    history.push('/consents');

    await waitFor(() => {
        expect(screen.queryByText("test1")).toBeInTheDocument();
        expect(screen.queryByText("test2")).toBeInTheDocument();
        expect(screen.queryByText("test3")).not.toBeInTheDocument();
        expect(screen.queryByText("<<< Previous Page")).not.toBeInTheDocument();
        expect(screen.queryByText("Next Page >>>")).toBeInTheDocument();
    });

    userEvent.click(screen.getByText("Next Page >>>"));

    await waitFor(() => {
        expect(screen.queryByText("test1")).not.toBeInTheDocument();
        expect(screen.queryByText("test2")).not.toBeInTheDocument();
        expect(screen.queryByText("test3")).toBeInTheDocument();
        expect(screen.queryByText("<<< Previous Page")).toBeInTheDocument();
        expect(screen.queryByText("Next Page >>>")).not.toBeInTheDocument();
    });
});
