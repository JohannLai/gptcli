<div align="center">
  <div>
    <img src=".github/screenshot.png" alt="GPTCLI"/>
    <h1 align="center">GPT CLI </h1>
  </div>
	<p>All in one ChatGPT CLI, build your own AI cli tools just like GitHub Actions workflow</p>
	<p>With GPT CLI, you can customize your CLI tools to suit your needs and make your work more efficient.</p>
	<p>秒级创建任意自定义 ChatGPT CLI 工具，就像创建一个 GitHub Actions 这么简单。</p>
	<a href="https://www.npmjs.com/package/@johannlai/gptcli"><img src="https://img.shields.io/npm/v/@johannlai/gptcli" alt="Current version"></a>
	<a href="https://github.com/semantic-release/semantic-release">
	<img src="https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg" alt="semantic-release">
	</a>
	<a href="https://github.com/JohannLai/gptcli/actions/workflows/npm-publish.yml"><img src="https://github.com/JohannLai/gptcli/actions/workflows/npm-publish.yml/badge.svg" alt="npm-publish"></a>
</div>

---

GPT CLI is a command-line interface tool that allows you to create your own ChatGPT CLI tools in seconds. It's as simple as creating a GitHub Actions workflow. With GPT CLI, you can customize your CLI tools to suit your needs and make your work more efficient.


## Features

- Create custom ChatGPT CLI tools in seconds
- Customize your CLI tools to suit your needs
- Easy to install and use

## Installation

You can install GPT CLI using npm or brew:

### npm
To run this CLI tool, you need to have Node.js version 18 or higher installed on your system. Additionally, you need to have npm version 8.x or higher installed as well.
```bash
npm install -g @johannlai/gptcli
```

### brew

```bash
brew install johannlai/tap/gptcli
```

## Built-in Plugins

GPT CLI comes with a variety of built-in plugins to help you get started. Here's a table of the current built-in plugins:

| Plugin      | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `chat`      | The `chat` plugin enables real-time interaction with the ChatGPT model directly in the terminal, allowing users to chat and get answers quickly and efficiently.                                                                                                                                                                                                                                                                                                                                                                                           |
| `command`   | The `command` plugin allows users to describe their desired command in natural language, and then outputs the corresponding plugin to fulfill the user's request. For example, if the user inputs "show all js files in the current folder", the plugin will output the corresponding plugin to display all the .js files in the current folder. This plugin makes it easier for users to find and utilize the appropriate plugins for their needs.                                                                                                        |
| `translate` | The `translate` plugin allows users to easily translate text within the terminal. By using this plugin, users can input any text they want to translate, choose their desired target language, and the plugin will output the translated text in the terminal. This plugin makes it more convenient for users to translate text without having to switch to a separate application or window.                                                                                                                                                              |
| `commit`    | The `commit` plugin allows users to generate a Git commit message automatically by simply entering `gptcli commit` in the terminal. The plugin will use the content from the `Git diff` to create a suitable commit message, making it easier for users to commit changes without having to manually craft a commit message themselves. This plugin helps streamline the Git commit process and saves users time and effort. **All the commit message is wrote by this plugin, awesome!!**    Inspired By [aicommit](https://github.com/Nutlope/aicommits) |
| `gitmoji`   | The gitmoji plugin allows users to generate Git commit messages in the [gitmoji](https://gitmoji.dev/) format by using the command "gptcli gitmoji" followed by a brief description of the commit, such as "fix a bug". This plugin utilizes emojis to provide visual representations of the type of commit being made(e.g: `🐛 fix a bug`), making it easier for users to categorize and understand the purpose of each commit.  🎉🚀👍                                                                                                                       |
| `cz`        | the `cz` plugin is the  [cz-cli](https://github.com/commitizen/cz-cli) plugin for ChatGPT. You can input the commit message, and cz plugin help you transform it into cz style(`fix: fix a bug`)                                                                                                                                                                                                                                                                                                                                                           |
| `weather`   | The `weather` plugin allows users to check the weather in any city with Natural language,  it will generate a curl command to curl [wttr.in                                    ](https://github.com/chubin/wttr.in), and show the weather information in the terminal                                                                                                                                                                                                                                                                                      |

## Customization

To create your own CLI plugin, you can use the `gpt-cli-plugin` command. Here's an example:



This will create a new plugin called `my-plugin`. You can then customize the plugin to suit your needs.

## License

GPT CLI is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.

## Other Information

For more information on how to use GPT CLI, please refer to the [wiki](https://github.com/myusername/gpt-cli/wiki).

---

_Build by GitHub & ChatGPT with love_
