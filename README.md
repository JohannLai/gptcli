<div align="center">
  <div>
    <img src=".github/icon.png" alt="GPTCLI" width="200"/>
    <h1 align="center">GPT CLI</h1>
    <a href="https://www.producthunt.com/posts/gptcli?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-gptcli" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=386821&theme=light" alt="gptcli - All&#0032;in&#0032;one&#0032;ChatGPT&#0032;CLI&#0032;for&#0032;AI&#0032;Commit&#0044;&#0032;AI&#0032;Command&#0044;&#0032;etc | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" /></a>
  </div>
	<p>All in one ChatGPT CLI, build your own AI cli tools just like GitHub Actions workflow</p>
	<p>With GPT CLI, you can customize your CLI tools to suit your needs and make your work more efficient.</p>
	<p>Convert NATURAL LANGUAGE PROCESSING (NLP) to into structured data. </p>
	<p>gptcli 内置 AI commmit（自动生成 commit message）、AI Command（自然语言转命令行）、翻译、gitmoji 等插件。秒级创建任意自定义 ChatGPT CLI 工具，就像创建一个 GitHub Actions 这么简单，让 AI 帮助我们链接自然语言和结构化数据。</p>
	<a href="https://www.npmjs.com/package/@johannlai/gptcli"><img src="https://img.shields.io/npm/v/@johannlai/gptcli" alt="Current version"></a>
	<a href="https://www.npmjs.com/package/@johannlai/gptcli">
	<img src="https://img.shields.io/npm/dw/@johannlai/gptcli">
	</a>
	<a href="https://github.com/semantic-release/semantic-release">
	<img src="https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg" alt="semantic-release">
	</a>
	<a href="https://github.com/JohannLai/gptcli/actions/workflows/npm-publish.yml"><img src="https://github.com/JohannLai/gptcli/actions/workflows/npm-publish.yml/badge.svg" alt="npm-publish"></a>
	<img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs welcome">
</div>

---

GPT CLI is a command-line interface tool that allows you to create your own ChatGPT CLI tools in seconds. It's as simple as creating a GitHub Actions workflow. With GPT CLI, you can customize your CLI tools to suit your needs and make your work more efficient.

> **Note:** ALL the commit message is wrote by this plugin, awesome!
>

<img src=".github/commit.gif" alt="commit-plugins" style="border-radius: 20px">


## 🚀 Features
- All in one ChatGPT CLI
- Create custom ChatGPT CLI tools in seconds
- Customize your CLI tools to suit your needs
- Easy to install and use

## 🔧 Installation

You can install GPT CLI using npm or brew:

### npm
To run this CLI tool, you need to have [**Node.js version 16+ **](https://nodejs.org/en), recommended to use [nvm](https://github.com/nvm-sh/nvm) to manage node version.

```bash
npm install -g @johannlai/gptcli
```

### brew(WIP)

```bash
brew install johannlai/tap/gptcli
```

## Setup alias convenience commands

These will add the commands to your shell, but only for the current session. To make them available in all future sessions, you should add the above command on a line by itself to the bottom of your `.zshrc` or `.bashrc` or equivalent.

```bash
eval "$(gptcli alias)"
```

NOW, you can use `??` to start AI Command

```bash
$ ?? "show all js files in the current folder"
> AI is thinking...
# then you will see the result
> ls -al | grep .js

# chat?
$ chat?
👽: Hi, I am ChatGpt, I can answer your questions. Ask me anything, or say "bye" to exit.
? 🫣 how git diff --cached add EXCLUDE

# translate ： t? "hello world"
$ t? "hello world"
> 你好，世界

# for more plugins, please check the plugins section
```

## 🧰 Built-in Plugins

GPT CLI comes with a variety of built-in plugins to help you get started. Here's a table of the current built-in plugins:

| Plugin      | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | Usage                                                                    |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `chat`      | The `chat` plugin enables real-time interaction with the ChatGPT model directly in the terminal, allowing users to chat and get answers quickly and efficiently.                                                                                                                                                                                                                                                                                                                                                                                           | `gptcli chat`     <br/>(alias `chat?`)                                   |
| `command`   | The `command` plugin allows users to describe their desired command in natural language, and then outputs the corresponding plugin to fulfill the user's request. For example, if the user inputs "show all js files in the current folder", the plugin will output the corresponding plugin to display all the .js files in the current folder. This plugin makes it easier for users to find and utilize the appropriate plugins for their needs.                                                                                                        | `gptcli command "write a command to list all js file"` <br/>(alias `??`) |
| `translate` | The `translate` plugin allows users to easily translate text within the terminal. By using this plugin, users can input any text they want to translate, choose their desired target language, and the plugin will output the translated text in the terminal. This plugin makes it more convenient for users to translate text without having to switch to a separate application or window.                                                                                                                                                              | `gptcli translate "你好" --to en`       <br/>(alias `t?`)                |
| `commit`    | The `commit` plugin allows users to generate a Git commit message automatically by simply entering `gptcli commit` in the terminal. The plugin will use the content from the `Git diff` to create a suitable commit message, making it easier for users to commit changes without having to manually craft a commit message themselves. This plugin helps streamline the Git commit process and saves users time and effort. **All the commit message is wrote by this plugin, awesome!!**    Inspired By [aicommit](https://github.com/Nutlope/aicommits) | `gptcli commit`    <br/>(alias `commit?`)                                |
| `gitmoji`   | The gitmoji plugin allows users to generate Git commit messages in the [gitmoji](https://gitmoji.dev/) format by using the command "gptcli gitmoji" followed by a brief description of the commit, such as "fix a bug". This plugin utilizes emojis to provide visual representations of the type of commit being made(e.g: `🐛 fix a bug`), making it easier for users to categorize and understand the purpose of each commit.  🎉🚀👍                                                                                                                       | `gptcli gitmoji "fix a bug"`                                             |
| `cz`        | the `cz` plugin is the  [cz-cli](https://github.com/commitizen/cz-cli) plugin for ChatGPT. You can input the commit message, and cz plugin help you transform it into cz style(`fix: fix a bug`)                                                                                                                                                                                                                                                                                                                                                           | `gptcli cz "fix a bug"`                                                  |
| `weather`   | The `weather` plugin allows users to check the weather in any city with Natural language,  it will generate a curl command to curl [wttr.in                                    ](https://github.com/chubin/wttr.in), and show the weather information in the terminal                                                                                                                                                                                                                                                                                      | `gptcli weather "Hongkong weather"`                                      |
| `notion`    | [WIP]                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | `gptcli notion create xxx`                                               |
| `whisper`   | [WIP]The `whisper` plugin will run whisper in local machine                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | `gptcli whisper "input.mp4"`                                             |


### Help of built-in plugins

You can get help for each plugin by running the following command:
```bash
# chat plugin
gptcli chat help

# command plugin
gptcli command help

# and so on
```

### List of built-in plugins

```bash
gptcli list
```

## 🛠️ Configuration

### User configuration
🎉 Now! feel free to use MY OWN ChatGPT API KEY, but it's not recommended, because it's not stable, you can use your own API KEY, just follow the steps below:
```bash
gptcli config user.OPENAI_API_KEY sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```
> You can get your own API KEY from [OpenAI](https://platform.openai.com/account/api-keys/)

### To configure the plugin
Some plugins require additional configuration to work properly. For example, the `commit` plugin requires a commit style to be specified. To configure the plugin, you can use the `gptcli config` command. For example, to configure the `commit` plugin to use the `cz` commit style, you can run the following command:

```bash
# cz style: fix: fix a bug
gptcli config commit.style cz
```

or gitmoji style:

```bash
# gitmoji style: 🐛 fix a bug
gptcli config commit.style gitmoji
```


## 👥 Community plugins

Coming soon...

Will be displayed in the website :)

For now, you can share your plugin with the community by submitting a pull request to add it to the list of community plugins. thanks! 👍

## 🎨 Customization, Build your own plugin in seconds

To create your own CLI plugin, you can fork [this template repository](https://github.com/JohannLai/gptcli-plugin-template) and customize it to suit your needs. You can test your plugin locally and then install it globally using gptcli. For more information on how to create your own plugin, [please refer to the template repository.](https://github.com/JohannLai/gptcli-plugin-template)

> Don't forget to share your plugin with the community by submitting a pull request to add it to the list of community plugins.


### It's easy to build your own plugin, just one YAML file

```yaml
name: joke
description: "joke plugin for gpt cli"
repository: "johannlai/joke"
author: "johannlai"
help: |
  joke plugin for gpt cli
  Usage:
    ❯ gpt joke
    ❯ "Why did the tomato turn red? Because it saw the salad dressing!"
steps:
  - name: "ask ai to output joke"
    # use the gpt:createChatCompletion action to create a chat completion
    uses: "gpt:createChatCompletion"
    with:
      messages:
        - role: "user"
          content: "tell me a joke"
    export:
      # export the response content to the JOKE environment variable
      response_content: JOKE
  - name: "output response"
    # output the JOKE environment variable
    script: |
      echo $JOKE
```
For more information, please refer to the [template repository](https://github.com/JohannLai/gptcli-plugin-template)

## 📜 License

GPT CLI is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.

## 📋 Other Information

For more information on how to use GPT CLI, please refer to the [official website](https://gptcli.com).

## Issues
Ask questions, report bugs, and request features on the [GitHub issues page](https://github.com/JohannLai/gptcli/issues)

---

💻 _Build by GitHub & ChatGPT with ❤️_
