import { twMerge } from 'tailwind-merge'

type ClassnameValue =
	| string
	| number
	| boolean
	| null
	| undefined
	| Record<string, unknown>
	| ClassnameValue[]
	| (() => ClassnameValue)

const MAX_DEPTH = 50

export const cn = (...args: ClassnameValue[]): string => {
	const classes: string[] = []
	const visited = new WeakSet<object>()

	const process = (value: ClassnameValue, depth: number = 0) => {
		if (depth > MAX_DEPTH) {
			console.error(`cn(): Recursion depth exceeded: ${depth} > ${MAX_DEPTH}`)

			return
		}

		if (value == null || value === false) {
			return
		}

		switch (typeof value) {
			case 'string': {
				const trimmed = value.trim()

				if (trimmed.length === 0) {
					return
				}

				classes.push(trimmed)

				return
			}

			case 'number': {
				if (Number.isFinite(value) && value !== 0) {
					classes.push(String(value))
				}

				return
			}

			case 'function': {
				if (visited.has(value)) {
					console.warn('cn(): Cyclic function reference detected')

					return
				}

				visited.add(value)

				try {
					process(value(), depth + 1)
				} finally {
					visited.delete(value)
				}

				return
			}

			case 'object': {
				if (Array.isArray(value)) {
					for (const item of value) {
						process(item, depth + 1)
					}

					return
				}

				if (visited.has(value)) {
					console.warn('cn(): Cyclic object reference detected')

					return
				}

				visited.add(value)

				const obj = value as Record<string, ClassnameValue>

				try {
					for (const key in obj) {
						if (Object.hasOwn(value, key)) {
							const item = obj[key]

							if (item != null && item !== false) {
								const trimmedKey = key.trim()
								if (trimmedKey.length > 0) {
									classes.push(trimmedKey)
								}
							}
						}
					}
				} finally {
					visited.delete(value)
				}

				return
			}

			case 'symbol':
			case 'bigint':
			case 'boolean':
			default:
				return
		}
	}

	for (const argument of args) {
		process(argument)
	}

	return twMerge(classes.join(' '))
}
