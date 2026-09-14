import { Args, Query, Resolver } from '@nestjs/graphql'

import { CategoryModel } from '@/src/modules/category/models/category.model'

import { CategoryService } from './category.service'

@Resolver('Category')
export class CategoryResolver {
	constructor(private readonly categoryService: CategoryService) {}

	@Query(() => [CategoryModel], { name: 'findAllCategories' })
	async findAll() {
		return this.categoryService.findAll()
	}

	@Query(() => [CategoryModel], { name: 'findRandomCategories' })
	async findRandom() {
		return this.categoryService.findRandom()
	}

	@Query(() => CategoryModel, { name: 'findCategoryBySlug' })
	async findBySlug(@Args('slug') slug: string) {
		return this.categoryService.findBySlug(slug)
	}
}
