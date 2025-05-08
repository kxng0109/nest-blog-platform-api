import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { SignUpDto } from 'src/auth/dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AppModule } from './../src/app.module';

describe('Blog plaform api e2e test', () => {
	let app: INestApplication;
	let prisma: PrismaService;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();
		app = moduleRef.createNestApplication();
		app.useGlobalPipes(
			new ValidationPipe({
				whitelist: true,
			}),
		);

		await app.init();
		await app.listen(3001);

		prisma = app.get(PrismaService);
		await prisma.user.deleteMany(); //Implement something to delete every user, post, comment on the test server

		pactum.request.setBaseUrl('http://localhost:3001/api');
	});

	afterAll(async () => {
		await app.close();
	});

	describe('Authenticate user', () => {
		const authDto: SignUpDto = {
			email: 'test@test.com',
			password: 'r@ndom123',
			role: 'USER',
		};

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
					.expectStatus(200)
					.expectBodyContains('access_token')
			});
			it("Return access token after successful login", async() =>{
				await pactum
					.spec()
					.post('/auth/signin')
					.withBody(authDto)
					.expectStatus(200)
					.expectBodyContains('access_token')
					.stores('userAt', 'access_token');
			})
		});
	});
});
