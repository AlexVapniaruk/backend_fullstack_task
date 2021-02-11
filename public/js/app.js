var app = new Vue({
	el: '#app',
	data: {
		login: '',
		pass: '',
		post: false,
		invalidLogin: false,
		invalidPass: false,
		invalidSum: false,
		posts: [],
		addSum: 0,
		amount: 0,
		likes: 0,
		commentText: '',
		parentId: null,
		packs: [
			{
				id: 1,
				price: 5
			},
			{
				id: 2,
				price: 20
			},
			{
				id: 3,
				price: 50
			},
		],
	},
	computed: {
		test: function () {
			var data = [];
			return data;
		}
	},
	created(){
		var self = this
		axios
			.get('/main_page/get_all_posts')
			.then(function (response) {
				self.posts = response.data.posts;
			})
	},
	methods: {
		logout: function () {
			console.log ('logout');
		},
		logIn: function () {
			var self= this;
			if(self.login === ''){
				self.invalidLogin = true
			}
			else if(self.pass === ''){
				self.invalidLogin = false
				self.invalidPass = true
			}
			else{
				self.invalidLogin = false
				self.invalidPass = false
				var formdata=new FormData();
				formdata.append("login", self.login);
				formdata.append("password", self.pass);
				axios.post('/main_page/login', formdata)
					.then(function (response) {
						window.location.href = '/';
						setTimeout(function () {
							$('#loginModal').modal('hide');
						}, 500);
					})
			}
		},
		fiilIn: function () {
			var self= this;
			if(self.addSum === 0){
				self.invalidSum = true
			}
			else{
				self.invalidSum = false
				axios.post('/main_page/add_money', {
					sum: self.addSum,
				})
					.then(function (response) {
						setTimeout(function () {
							$('#addModal').modal('hide');
						}, 500);
					})
			}
		},
		treeComments(comments) {
			console.log(comments);

			let comments_array = comments;
			let keyed = [];
			comments_array.forEach( item => {
					item.children = [];
					keyed[item.id] = item;
				});
        	console.log(keyed);
        	let tree = [];
			keyed.forEach( item => {
				let parent = item.parent_id;
				console.log(item);
        		if(parent !== null) {
					keyed[parent].children.push(item);
				} else {
        			tree.push(item);
				}
				});
			comments_array = tree;
			return comments_array;
		},
		openPost: function (id) {
			var self= this;
			axios
				.get('/main_page/get_post/' + id)
				.then(function (response) {
					response.data.post.coments = self.treeComments(response.data.post.coments)
					self.post = response.data.post
					if(self.post){
						setTimeout(function () {
							$('#postModal').modal('show');
						}, 500);
					}
				})
		},
		addLike: function (id) {
			var self= this;
			axios
				.get('/main_page/like')
				.then(function (response) {
					self.likes = response.data.likes;
				})

		},
		buyPack: function (id) {
			var self= this;
			axios.post('/main_page/buy_boosterpack', {
				id: id,
			})
				.then(function (response) {
					self.amount = response.data.amount
					if(self.amount !== 0){
						setTimeout(function () {
							$('#amountModal').modal('show');
						}, 500);
					}
				})
		},
		addComment(postId) {
			var formdata=new FormData();
			formdata.append("post_id", postId);
			formdata.append("comment", this.commentText);
			formdata.append("parent_id", this.parentId);
			axios.post('/main_page/comment', formdata)
				.then((response) => {
					this.openPost(postId);
				})
		},
		replyToComment(commentId) {
			this.parentId = commentId
		}
	}
});

