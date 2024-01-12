import { proto } from "@whiskeysockets/baileys"
import { AuthenticationCreds, AuthenticationState, SignalDataTypeMap, initAuthCreds, BufferJSON } from "@whiskeysockets/baileys"
import redis from '../redis'

export const useRedisAuthState = async(instanceid: string): Promise<{ state: AuthenticationState, saveCreds: () => Promise<void> }> => {
	const writeData = async (data: any, id: string) => {
		await redis.set(`auth:${instanceid}:${id}`, JSON.stringify(data, BufferJSON.replacer))
	}

	const readData = async(file: string) => {
		try {
			const data = await redis.get(`auth:${instanceid}:${file}`)
			return JSON.parse(data!, BufferJSON.reviver)
		} catch(error) {
			return null
		}
	}

	const removeData = async(file: string) => {
		try {
			await redis.del(`auth:${instanceid}:${file}`)
		} catch{

		}
	}

	const creds: AuthenticationCreds = await readData('creds.json') || initAuthCreds()

	return {
		state: {
			creds,
			keys: {
				get: async(type, ids) => {
					const data: { [_: string]: SignalDataTypeMap[typeof type] } = { }
					await Promise.all(
						ids.map(
							async id => {
								let value = await readData(`${type}-${id}.json`)
								if (type === 'app-state-sync-key' && value) {
									value = proto.Message.AppStateSyncKeyData.fromObject(value)
								}

								data[id] = value
							}
						)
					)

					return data
				},
				set: async(data) => {
					const tasks: Promise<void>[] = []
					for(const category in data) {
						for(const id in data[category]) {
							const value = data[category][id]
							const dataId = `${category}-${id}`
							tasks.push(value ? writeData(value, dataId) : removeData(dataId))
						}
					}

					await Promise.all(tasks)
				}
			}
		},
		saveCreds: () => {
			return writeData(creds, "creds")
		}
	}
}
