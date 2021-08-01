// Backbone Model
const Blog = Backbone.Model.extend({
  defaults: {
    author: '',
    title: '',
    url: ''
  }
});

// Backbone collection
const Blogs = Backbone.Collection.extend({
  url: 'http://localhost:3000/blogs'
});

// Instantiate collection
const blogs = new Blogs([]);

// Backbone view
// View for one blog
const BlogView = Backbone.View.extend({
  model: new Blog(),
  tagName: 'tr',
  events: {
    'click .edit-blog': 'edit',
    'click .update-blog': 'update',
    'click .cancel-blog': 'cancel',
    'click .delete-blog': 'delete'
  },
  edit(){
    $('.edit-blog').hide();
    $('.delete-blog').hide();
    this.$('.update-blog').show();
    this.$('.cancel-blog').show();

    const author = this.$('.author').html();
    const title = this.$('.title').html();
    const url = this.$('.url').html();

    this.$('.author').html(`<input value="${author}" class="author-update"></input>`);
    this.$('.title').html(`<input value="${title}" class="title-update"></input>`);
    this.$('.url').html(`<input value="${url}" class="url-update"></input>`);
  },
  update(){
    this.model.set('author', $('.author-update').val());
    this.model.set('title', $('.title-update').val());
    this.model.set('url', $('.url-update').val());
  },
  cancel(){
    blogsView.render();
  },
  delete(){
    this.model.destroy();
  },
  initialize() {
    this.template = _.template($('.blogs-list-template').html());
  },
  render(){
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  }
});

// View for all blogs
const BlogsView = Backbone.View.extend({
  model: blogs,
  el: $('.blogs-list'),
  initialize(){
    this.model.on('add', this.render, this);
    this.model.on('change', () => {
      setTimeout(() => this.render(), 30);
    }, this);
    this.model.on('remove', this.render, this);
    this.model.fetch({
      success(res) {
        _.each(res.toJSON(), item => {
          console.log('fetched item - ', item);
        });
      },
      error() {
        console.log('Failed to fetch blogs');
      }
    });
  },
  render(){
    this.$el.html('');
    _.each(this.model.toArray(), (blog) => {
      this.$el.append((new BlogView({model: blog})).render().$el);
    });
    return this;
  }
});

const blogsView = new BlogsView();

document.querySelector('.add-blog').addEventListener('click', () => {
  const author = document.querySelector('.author-input');
  const title = document.querySelector('.title-input');
  const url = document.querySelector('.url-input');

  const blog = new Blog({
    author: author.value,
    title: title.value,
    url: url.value
  });
  blogs.add(blog);
  blog.save(null, {
    success(){
      console.log('Success to add new blog to db');
    },
    error(){
      console.log('Something go wrong');
    }
  });
});