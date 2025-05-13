import * as pactum from 'pactum';
import { SignUpDto } from 'src/auth/dto';
import { CreatePostDto } from 'src/post/dto';
import { closeApp, initApp } from './helpers/app.init';

describe('Comment e2e test', () => {
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

	describe('Create a comment', () => {
		it('POST /posts/{id}/comments return 201 and the comment', async () => {
			await pactum
				.spec()
				.post('/posts/{id}/comments')
				.withPathParams('id', '$S{postId}')
				.withBearerToken('$S{userAt}')
				.withBody({
					text: 'This is nice. Well done!',
				})
				.expectStatus(201)
				.stores('commentId', 'id');
		});
	});

	describe('Get comments', () => {
		it('GET /posts/{id}/comments return 200 and the comments under the post', async () => {
			await pactum
				.spec()
				.get('/posts/{id}/comments')
				.withPathParams('id', '$S{postId}')
				.withBearerToken('$S{userAt}')
				.expectStatus(200);
		});
	});

	describe('Update comment', () => {
		it('PATCH /comments/{id} return 200 and updated comment', async () => {
			await pactum
				.spec()
				.patch('/comments/{id}')
				.withPathParams('id', '$S{commentId}')
				.withBearerToken('$S{userAt}')
				.withBody({
					title: 'My not first post',
					published: true,
				})
				.expectStatus(200);
		});
	});

	describe('Delete comment', () => {
		it('DELETE /comments/{id} return 204', async () => {
			await pactum
				.spec()
				.delete('/comments/{id}')
				.withPathParams('id', '$S{commentId}')
				.withHeaders('Authorization', 'Bearer $S{userAt}')
				.expectStatus(204);
		});
	});
});
