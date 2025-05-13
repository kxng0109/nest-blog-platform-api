import * as pactum from 'pactum';
import { SignUpDto } from 'src/auth/dto';
import { closeApp, initApp } from './helpers/app.init';

describe('Authenticate user', () => {
	const authDto: SignUpDto = {
		email: 'test1@test.com',
		password: 'r@ndom123',
		role: 'USER',
	};

	beforeAll(async () => {
		await initApp();
	});

	afterAll(async () => {
		await closeApp();
	});

	describe('Sign up with mssing or incomplete body', () => {
		it('Should return 400 due to empty body', async () => {
			await pactum.spec().post('/auth/signup').expectStatus(400);
		});

		it('should return 400 due to incomplete body', async () => {
			await pactum
				.spec()
				.post('/auth/signup')
				.withBody({
					email: authDto.email,
				})
				.expectStatus(400);
		});
	});

	describe('Successful authentication', () => {
		it('Return access token after successful sign up', async () => {
			await pactum
				.spec()
				.post('/auth/signup')
				.withBody(authDto)
				.expectStatus(201)
				.expectBodyContains('access_token');
		});

		it('Return access token after successful login', async () => {
			await pactum
				.spec()
				.post('/auth/signin')
				.withBody(authDto)
				.expectStatus(200)
				.expectBodyContains('access_token')
				.stores('userAt', 'access_token');
		});
	});
});
