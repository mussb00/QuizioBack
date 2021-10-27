
const {User} = require('../../dbConfig/init.js')
const userControllers = require('../../Controllers/userControllers')
const authControllers = require('../../Controllers/authControllers')



const mockSend = jest.fn();
const mockJson = jest.fn();
const mockStatus = jest.fn(code => ({ send: mockSend, json: mockJson }))
const mockRes = { status: mockStatus }

describe('user controller', () => {
    beforeEach(() => jest.clearAllMocks());

    afterAll(() => jest.resetAllMocks());


    describe('user controllers', () => {
        it('updates user with new score and game count', async () => {
            let testReq = {
                 email:"test@test.com",
                 total_scores: 2
            }
            let testUser={
                email: "test@test.com",
                username: "test",
                total_scores: 2,
                total_games: 1
            }
           const mockUpdate =  jest.spyOn(User, 'update')
              //  .mockResolvedValue(testUser);
            const mockReq = { body: testReq }
            await userControllers.update(mockReq, mockRes);
            //expect(mockStatus).toHaveBeenCalledWith(201);
            expect(mockUpdate).toHaveBeenCalledTimes(1);
        })
    });


    it('responds with leaderboard', async () => {
        // const testLeaderboard=[10,9,8,7,6]
        const liderboard = jest.spyOn(userControllers, 'leaderboard')
          //  .mockResolvedValue(testLeaderboard);
       // const mockReq = { }
       // await userControllers.leaderboard(mockReq, mockRes);
        expect(liderboard).toHaveBeenCalledTimes(1);
        //expect(mockJson).to;
    })
});

