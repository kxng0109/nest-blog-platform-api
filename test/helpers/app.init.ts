import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as pactum from 'pactum';
import { AppModule } from 'src/app.module';

let app: INestApplication;

export const initApp = async () => {
	const moduleRef: TestingModule = await Test.createTestingModule({
		imports: [AppModule],
	}).compile();

	app = moduleRef.createNestApplication();

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			transform: true,
			transformOptions: {
				enableImplicitConversion: true,
			},
		}),
	);
	app.setGlobalPrefix('api');

	await app.init();
	await app.listen(3001);
	pactum.request.setBaseUrl('http://localhost:3001/api');
};

export const closeApp = async () => {
	await app.close();
};
