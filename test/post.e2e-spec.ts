import * as pactum from 'pactum';
import { SignUpDto } from 'src/auth/dto';
import { CreatePostDto } from 'src/post/dto';
import { closeApp, initApp } from './helpers/app.init';

describe('Post e2e test', () => {
	const authDto: SignUpDto = {
		email: 'test@test.com',
		password: 'r@ndom123',
		role: 'USER',
	};

	const createPostDto: CreatePostDto = {
		title: 'A title',
		content:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque arcu eros, venenatis vel mauris ac, fermentum accumsan urna. Vestibulum enim nisl, rutrum sed sodales in, feugiat a quam. Integer imperdiet fermentum nisi nec accumsan. Curabitur eleifend consectetur iaculis. In sodales felis ac pulvinar feugiat. Vestibulum fermentum odio dictum, viverra nisl nec, venenatis elit. Phasellus dignissim tincidunt purus ac accumsan. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Curabitur viverra arcu id justo bibendum congue. Aenean eros tellus, tristique quis consectetur nec, efficitur nec ipsum. Nullam eu lectus tortor.',
	};

	beforeAll(async () => {
		await initApp();
		await pactum
			.spec()
			.post('/auth/signin')
			.withBody(authDto)
			.expectStatus(200)
			.stores('userAt', 'access_token');
		await pactum
			.spec()
			.post('/posts')
			.withBody(createPostDto)
			.withBearerToken('$S{userAt}')
			.expectStatus(201)
			.stores('postId', 'id');
	});

	afterAll(async () => {
		await closeApp();
	});

	describe('Create a post', () => {
		it('POST /posts return 201 and a new post', async () => {
			await pactum
				.spec()
				.post('/posts/')
				.withBearerToken('$S{userAt}')
				.withBody(createPostDto)
				.expectStatus(201)
				.stores('postId', 'id');
		});
	});

	describe('Get posts', () => {
		describe('Get all posts', () => {
			it('GET /posts return 200 and an array of posts', async () => {
				await pactum
					.spec()
					.get('/posts/')
					.withBearerToken('$S{userAt}')
					.expectStatus(200);
			});
		});

		describe('Get a post by its id', () => {
			it('GET /posts/{id} return 200 and the post', async () => {
				await pactum
					.spec()
					.get('/posts/{id}')
					.withPathParams('id', '$S{postId}')
					.withBearerToken('$S{userAt}')
					.expectStatus(200);
			});
		});
	});

	describe('Update a post', () => {
		it('PATCH /posts/{id} return 200 and updated post', async () => {
			await pactum
				.spec()
				.patch('/posts/{id}')
				.withPathParams('id', '$S{postId}')
				.withBearerToken('$S{userAt}')
				.withBody({
					content: 'That was too long',
				})
				.expectStatus(200);
		});
	});

	describe('Delete posts', () => {
		it('DELETE /posts/{id} return 204', async () => {
			await pactum
				.spec()
				.delete('/posts/{id}')
				.withPathParams('id', '$S{postId}')
				.withBearerToken('$S{userAt}')
				.expectStatus(204);
		});

		it('DELETE /posts return 204', async () => {
			await pactum
				.spec()
				.delete('/posts/')
				.withBearerToken('$S{userAt}')
				.expectStatus(204);
		});
	});
});
