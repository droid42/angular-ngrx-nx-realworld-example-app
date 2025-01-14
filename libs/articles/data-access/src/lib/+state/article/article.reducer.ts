import { Article, Comment } from '@realworld/core/api-types';
import { createFeature, createReducer, on } from '@ngrx/store';
import * as ArticleActions from './article.actions';
import * as ArticlesActions from '../articles.actions';

export interface ArticleState {
  data: Article;
  comments: Comment[];
  loading: boolean;
  loaded: boolean;
}

export const articleInitialState: ArticleState = {
  data: {
    slug: '',
    title: '',
    description: '',
    body: '',
    tagList: [],
    createdAt: '',
    updatedAt: '',
    favorited: false,
    favoritesCount: 0,
    author: {
      username: '',
      bio: '',
      image: '',
      following: false,
      loading: false,
    },
  },
  comments: [],
  loaded: false,
  loading: false,
};

export const articleFeature = createFeature({
  name: 'article',
  reducer: createReducer(
    articleInitialState,
    on(ArticleActions.loadArticleSuccess, (state, action) => ({
      ...state,
      data: action.article,
      loaded: true,
      loading: false,
    })),
    on(ArticleActions.loadArticleFail, (state) => ({
      ...state,
      data: articleInitialState.data,
      loaded: false,
      loading: false,
    })),
    on(ArticleActions.addCommentSuccess, (state, action) => {
      const comments: Comment[] = [action.comment, ...state.comments];
      return { ...state, comments };
    }),
    on(ArticleActions.deleteCommentSuccess, (state, action) => {
      const comments: Comment[] = state.comments.filter((item) => item.id !== action.commentId);
      return { ...state, comments };
    }),
    on(ArticleActions.initializeArticle, (state) => articleInitialState),
    on(ArticleActions.deleteArticleFail, (state) => articleInitialState),
    on(ArticleActions.loadCommentsSuccess, (state, action) => ({
      ...state,
      comments: action.comments,
    })),
    on(ArticleActions.loadCommentsFail, (state) => ({
      ...state,
      comments: articleInitialState.comments,
    })),
    on(ArticleActions.followSuccess, ArticleActions.unFollowSuccess, (state, action) => {
      const data: Article = { ...state.data, author: action.profile };
      return { ...state, data };
    }),
    on(ArticlesActions.favoriteSuccess, ArticlesActions.unFavoriteSuccess, (state, action) => ({
      ...state,
      data: action.article,
    })),
  ),
});
