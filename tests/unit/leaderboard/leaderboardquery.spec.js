import leaderQuery from '@/resources/leaderQuery'

describe ('Win Rate leaderboards', () => {
  describe ('Different Win Rate, Different Elo', () => {
    it('Sorts by win rate exclusively', () => {
      //Arrange
      const leaders = [
        {
          username: 'A',
          win_rate: 0.7,
          points: 10
        },
        {
          username: 'B',
          win_rate: 0.9,
          points: 20
        },
        {
          username: 'C',
          win_rate: 0.5,
          points: 30
        }
      ]

      const expected = [
        {
          username: 'B',
          win_rate: 0.9,
          points: 20
        },
        {
          username: 'A',
          win_rate: 0.7,
          points: 10
        },
        {
          username: 'C',
          win_rate: 0.5,
          points: 30
        }
      ]

      //Act
      const result = leaders.sort(leaderQuery.sortWinRateThenElo)

      //Assert
      expect(result).toStrictEqual(expected)
    })
  }),

  describe ('Different Win Rate, Same Elo', () => {
    it('Sorts by win rate exclusively', () => {
      //Arrange
      const leaders = [
        {
          username: 'A',
          win_rate: 0.7,
          points: 20
        },
        {
          username: 'B',
          win_rate: 0.9,
          points: 20
        },
        {
          username: 'C',
          win_rate: 0.5,
          points: 20
        }
      ]

      const expected = [
        {
          username: 'B',
          win_rate: 0.9,
          points: 20
        },
        {
          username: 'A',
          win_rate: 0.7,
          points: 20
        },
        {
          username: 'C',
          win_rate: 0.5,
          points: 20
        }
      ]

      //Act
      const result = leaders.sort(leaderQuery.sortWinRateThenElo)

      //Assert
      expect(result).toStrictEqual(expected)
    })
  }),

  describe ('Same Win Rate, Different Elo', () => {
    it('Sorts by elo when win rate is the same, otherwise by elo', () => {
      //Arrange
      const leaders = [
        {
          username: 'A',
          win_rate: 0.7,
          points: 10
        },
        {
          username: 'B',
          win_rate: 0.9,
          points: 20
        },
        {
          username: 'C',
          win_rate: 0.7,
          points: 30
        }
      ]

      const expected = [
        {
          username: 'B',
          win_rate: 0.9,
          points: 20
        },
        {
          username: 'C',
          win_rate: 0.7,
          points: 30
        },
        {
          username: 'A',
          win_rate: 0.7,
          points: 10
        }
      ]

      //Act
      const result = leaders.sort(leaderQuery.sortWinRateThenElo)

      //Assert
      expect(result).toStrictEqual(expected)
    })
  }),

  describe ('Same Win Rate, Same Elo', () => {
    it('Retains input order', () => {
      //Arrange
      const leaders = [
        {
          username: 'A',
          win_rate: 0.4,
          points: 20
        },
        {
          username: 'B',
          win_rate: 0.4,
          points: 20
        },
        {
          username: 'C',
          win_rate: 0.9,
          points: 10
        }
      ]

      const expected = [
        {
          username: 'C',
          win_rate: 0.9,
          points: 10
        },
        {
          username: 'A',
          win_rate: 0.4,
          points: 20
        },
        {
          username: 'B',
          win_rate: 0.4,
          points: 20
        }
      ]

      //Act
      const result = leaders.sort(leaderQuery.sortWinRateThenElo)

      //Assert
      expect(result).toStrictEqual(expected)
    })
  })
})

describe ('Total Wins leaderboards', () => {
  describe ('Different Total Wins, Different Elo', () => {
    it('Sorts by total wins exclusively', () => {
      //Arrange
      const leaders = [
        {
          username: 'A',
          total_wins: 70,
          points: 10
        },
        {
          username: 'B',
          total_wins: 90,
          points: 20
        },
        {
          username: 'C',
          total_wins: 50,
          points: 30
        }
      ]

      const expected = [
        {
          username: 'B',
          total_wins: 90,
          points: 20
        },
        {
          username: 'A',
          total_wins: 70,
          points: 10
        },
        {
          username: 'C',
          total_wins: 50,
          points: 30
        }
      ]

      //Act
      const result = leaders.sort(leaderQuery.sortTotalWinsThenElo)

      //Assert
      expect(result).toStrictEqual(expected)
    })
  }),

  describe ('Same Total Wins, Same Elo', () => {
    it('Retain input order', () => {
      //Arrange
      const leaders = [
        {
          username: 'A',
          total_wins: 70,
          points: 10
        },
        {
          username: 'B',
          total_wins: 90,
          points: 30
        },
        {
          username: 'C',
          total_wins: 90,
          points: 30
        }
      ]

      const expected = [
        {
          username: 'B',
          total_wins: 90,
          points: 30
        },
        {
          username: 'C',
          total_wins: 90,
          points: 30
        },
        {
          username: 'A',
          total_wins: 70,
          points: 10
        }
      ]

      //Act
      const result = leaders.sort(leaderQuery.sortTotalWinsThenElo)

      //Assert
      expect(result).toStrictEqual(expected)
    })
  }),

  describe ('Different Total Wins, Same Elo', () => {
    it('Sorts by total wins exclusively', () => {
      //Arrange
      const leaders = [
        {
          username: 'A',
          total_wins: 70,
          points: 20
        },
        {
          username: 'B',
          total_wins: 90,
          points: 20
        },
        {
          username: 'C',
          total_wins: 50,
          points: 20
        }
      ]

      const expected = [
        {
          username: 'B',
          total_wins: 90,
          points: 20
        },
        {
          username: 'A',
          total_wins: 70,
          points: 20
        },
        {
          username: 'C',
          total_wins: 50,
          points: 20
        }
      ]

      //Act
      const result = leaders.sort(leaderQuery.sortTotalWinsThenElo)

      //Assert
      expect(result).toStrictEqual(expected)
    })
  }),

  describe ('Same Total Wins, Different Elo', () => {
    it('Sorts by elo when total wins is same, otherwise by total wins', () => {
      //Arrange
      const leaders = [
        {
          username: 'A',
          total_wins: 70,
          points: 10
        },
        {
          username: 'B',
          total_wins: 90,
          points: 20
        },
        {
          username: 'C',
          total_wins: 70,
          points: 30
        }
      ]

      const expected = [
        {
          username: 'B',
          total_wins: 90,
          points: 20
        },
        {
          username: 'C',
          total_wins: 70,
          points: 30
        },
        {
          username: 'A',
          total_wins: 70,
          points: 10
        }
      ]

      //Act
      const result = leaders.sort(leaderQuery.sortTotalWinsThenElo)

      //Assert
      expect(result).toStrictEqual(expected)
    })
  })
})