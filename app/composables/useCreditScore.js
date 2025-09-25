export const useCreditScore = () => {
  const { apiGet, apiPost } = useApi()

  const getUserCreditScore = async () => {
    try {
      const response = await apiGet('/credit-score/user-credit-score')
      return response.data
    } catch (error) {
      console.error('Error fetching user credit score:', error)
      return {
        hasCreditScore: false,
        creditScore: null,
        creditScoreTier: null,
        message: 'Error retrieving credit score'
      }
    }
  }

  const getMultipleUserCreditScores = async (userIds) => {
    try {
      const response = await apiPost('/credit-score/multiple-credit-scores', {
        userIds
      })
      return response.data
    } catch (error) {
      console.error('Error fetching multiple user credit scores:', error)
      return {}
    }
  }

  return {
    getUserCreditScore,
    getMultipleUserCreditScores
  }
}
