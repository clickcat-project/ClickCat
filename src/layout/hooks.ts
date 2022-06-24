import { useRouter } from 'vue-router'

export const useGoTo = () => {
  const router = useRouter()
  return (name: string) => {
    router.push({
      name
    })
  }
}