# Tools of Fantasy
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/nandakho/tools-of-fantasy/blob/main/LICENSE)
[![GitHub Issues](https://img.shields.io/github/issues/nandakho/tools-of-fantasy.svg)](https://github.com/nandakho/tools-of-fantasy/issues)
[![GitHub Stars](https://img.shields.io/github/stars/nandakho/tools-of-fantasy.svg)](https://github.com/nandakho/tools-of-fantasy/stargazers)

## Description
This project is still in **development!**  
Tools of Fantasy is a serverless tools built with the Ionic-Angular framework, designed to assist players in the MMO game \"Tower of Fantasy\".  
This project aims to provide various helpful tools to enhance the gaming experience for players.  
Well, mostly useful for those who cares about numbers.  

Currently, the project offers the following tools:  
- **Gear Compare**: This tool can helps players calculate which is the optimal gear for their characters. No more confusion to choose which gear gives higher boost to your stats between two gears!  
- **Crit Calculator**: The Crit Calculator enables players to calculate the critical hit chance of their characters based on their stats and target level. It's finally here! You can now calculate how much base critical is "enough" against lower level enemies. As a bonus it can also calculate how much base crit is needed to reach a certain crit % that you want.  
- **(WIP) My Character**: Set your character info here, then it can be used in other tools! Or you can use it as a character simulation to see the "what if" scenario of your char. Like how your stats will look at max enhancement equipment, max advancement weapon, matrix etc. Still a work in progress, planned to make a better UI, but hey it's already functional, so give it a try I guess..  
- **Suggestion?**: Open an issue for feature request, if it's possible I might add it..  

More tools will be added in future updates to further enhance the functionality and usability of the project.

## Run Locally
You can just visit the [online version here](https://tof.nandakho.my.id/),  
or to install and use Tools of Fantasy locally, you can follow these steps:  
1. Clone this repository to your local machine using the following command:  
```bash
git clone https://github.com/nandakho/tools-of-fantasy.git
```
2. Navigate to the project directory:  
```bash
cd tools-of-fantasy
```
3. Install the necessary dependencies using npm:  
```bash
npm install
```
4. Build the project:  
Notes: You might need to install ionic globally first with `npm i -g @ionic/cli`  
More info at [ionic's official site](https://ionicframework.com/docs/intro/cli)
```bash
npm run build:ssr
```
5. Run the project locally:  
```bash
npm run serve:ssr
```
6. Access the application through your web browser at [http://localhost:4001](http://localhost:4001).

## Contributing
Contributions to the Tools of Fantasy project are welcome and encouraged.  
If you have suggestions for new features, bug fixes, or improvements, feel free to open a pull request to the main repository.

## License
This project is licensed under the MIT License.  
See the [LICENSE](https://github.com/nandakho/tools-of-fantasy/blob/master/LICENSE) file for more information.