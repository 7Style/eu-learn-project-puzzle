export class Config {

    static APP_NAME = 'JupoRob';

    static COMMAND_STORAGE_KEY = 'commands';

    static LEVEL_STORAGE_KEY = 'level';

    static DEFAULT_PATHS_CELL = [
       0, 1, 2, 12, 22, 23, 24, 25, 26, 27, 37, 47, 57, 67, 68, 69, 79, 89, 88, 87, 86, 85, 75, 65, 55, 54, 53, 52, 62, 72, 82, 92, 91, 90
    ];


    static PATHS_LEVEL_2 = [
        7, 8, 9, 19, 29, 39, 49, 48, 47, 46, 45, 44, 34, 24, 14, 13, 12, 11, 10, 20, 30, 40, 50, 60, 70, 80, 81
    ];


    static minCommandsCountToStartGame = 1;

    static LEVEL_TIME_LIMIT = 60;

    static LEVEL_1 = {
        title: 'Game Instructions for Level 1',
        text: '1Please create your path to start the game. You need to ensure that the game character JupoRob reaches the finish, based on the path you have created, without straying off the path'
    }

    static LEVEL_2 = {
        title: 'Game Instructions for Level 2',
        text: '2Please create your path to start the game. You need to ensure that the game character JupoRob reaches the finish, based on the path you have created, without straying off the path'
    }

    static LEVEL_3 = {
        title: 'Game Instructions for Level 3',
        text: '3Please create your path to start the game. You need to ensure that the game character JupoRob reaches the finish, based on the path you have created, without straying off the path'
    }

    static LEVEL_4 = {
        title: 'Game Instructions for Level 4',
        text: '4 Based on the path you have created, without straying off the path'
    }

    static LEVEL_INSTRUCTIONS = [
        Config.LEVEL_1,
        Config.LEVEL_2,
        Config.LEVEL_3,
        Config.LEVEL_4
    ]


}
