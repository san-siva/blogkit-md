# The Ultimate Guide to Managing Multiple Git Accounts & SSH Keys

Managing multiple GitHub accounts for work, side projects,  
and open-source contributions doesn't have to be a nightmare. Here is a straightforward guide to keeping your personal and professional Git environments perfectly separated.

## The Problem

By default, Git uses a single global identity — one name, one email, and one SSH key. When you have multiple GitHub accounts (e.g. a personal account and a work account), every repo on your machine will commit under the same identity, and SSH will always try the same key regardless of which account you need.

You wouldn't want to accidentally commit to an open-source repository with your work email, or vice versa.

## Managing multiple GitHub accounts

### Organize your workspaces

Organize your workspaces in a way that makes sense to you. This way you will always know which git config you need to use for which repo, based on your working path.

```bash
# Organize your workspaces
.
├── opensource # Open-source projects should use san-siva@gmail.com
├── sidegig    # Side Projects, should use san-siva@sidegig.com
└── work       # Personal projects, should use san-siva@work.com
```

### Setup your global git config

Start by configuring your global `~/.gitconfig` file. It should contain your primary name and email address, acting as the default fallback identity for any repository outside your specialized workspaces.

```bash
# ~/.gitconfig
[user]
	email = san-siva@gmail.com
	name = Santhosh Siva
[pull]
	rebase = false # set this to true if you want to rebase instead of merge
[submodule]
	recurse = true # optional, if you are dealing with monorepos
```

### Set up workspace-specific Git configs

Next, create a dedicated Git configuration file for each workspace. This file will dictate the specific identity you want to use for that particular directory.

For example, I created `~/.gitconfig__work` for my work-related projects, and `~/.gitconfig__sidegig` for my side projects.

```bash
# ~/.gitconfig__work
[user]
	email = san-siva@work.com
	name = Santhosh Siva
[pull]
	rebase = false
[submodule]
	recurse = true
```

```bash
# ~/.gitconfig__sidegig
[user]
	email = san-siva@sidegig.com
	name = Santhosh Siva
[pull]
	rebase = false
[submodule]
	recurse = true
```

Since my global `~/.gitconfig` file already acts as the default identity for the rest of my system, and I use my personal email for open-source commits, I don't need to create a separate config for those.

### Link them back to the global config

Now you need to let Git know which config file to use for which directory. This is done using the `includeIf` directive in `~/.gitconfig`.

```bash
# ~/.gitconfig
[user]
	email = san-siva@gmail.com
	name = Santhosh Siva
[pull]
	rebase = false # set this to true if you want to rebase instead of merge
[submodule]
	recurse = true # optional, if you are dealing with monorepos

# Add these lines to your global config
[includeIf "gitdir:/Users/san.siva/work/"]
  path = ~/.gitconfig__work
[includeIf "gitdir:/Users/san.siva/sidegig/"]
  path = ~/.gitconfig__sidegig
```

For example, if I edit `~/work/react/app/package.json`, Git will author my commits using `san-siva@work.com`. This happens because the `includeIf "gitdir:/Users/san.siva/work/"` directive detects that the repository is inside the work directory and automatically applies the settings from `~/.gitconfig__work`.

## Managing multiple SSH keys

### Generate a unique SSH key for each account

Start by creating a dedicated SSH key for each of your GitHub accounts. Using the **ed25519** algorithm is highly recommended, as it is faster and more secure than the older RSA standard.

```bash
# Generate a new SSH key

ssh-keygen -t ed25519 -C "san-siva@gmail.com" -f ~/.ssh/personal
# The above command will create two files:
# ~/.ssh/personal
# ~/.ssh/personal.pub

ssh-keygen -t ed25519 -C "san-siva@work.com" -f ~/.ssh/work
ssh-keygen -t ed25519 -C "san-siva@sidegig.com" -f ~/.ssh/sidegig
```

### Add your public SSH key to GitHub

Once generated, copy the contents of the public key file (usually ending in `.pub`) to your clipboard. Then, log into the corresponding GitHub account and paste the key into your settings at `https://github.com/settings/keys`.

Check out the official GitHub documentation for more detailed instructions.

### Add the SSH key to your SSH agent

The SSH agent is a program that manages your SSH keys, allowing you to authenticate with GitHub without having to enter your password every time.

```bash
# Add the SSH key to the SSH agent

# macOS
ssh-add -K ~/.ssh/personal
ssh-add -K ~/.ssh/work
ssh-add -K ~/.ssh/sidegig

# Linux
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/personal
ssh-add ~/.ssh/work
ssh-add ~/.ssh/sidegig
```

On macOS, add **UseKeychain yes** and **AddKeysToAgent yes** to your **~/.ssh/config** to have your keys persist across reboots automatically.

### Create multiple SSH aliases for each GitHub account

Now that you have your SSH keys set up, you need to update your `~/.ssh/config` file to use the correct key for each alias.

```bash
# ~/.ssh/config

Host github
    HostName github.com # Default
    User git
    IdentityFile ~/.ssh/personal
    IdentitiesOnly no

Host github-work # This is an alias for your work account
    HostName github.com
    User git
    IdentityFile ~/.ssh/work
    IdentitiesOnly yes

Host github-sidegig # This is an alias for your side project
    HostName github.com
    User git
    IdentityFile ~/.ssh/sidegig
    IdentitiesOnly yes
```

Here is the best part: because of the `insteadOf` directive in our conditionally loaded workspace configs, you don't even need to change your clone URLs! You can continue using standard `git@github.com` links, and Git will automatically swap in `github-work` or `github-sidegig` behind the scenes to trigger the correct SSH key.

### Update your gitconfig files to use the correct SSH key for each workspace

Now that you have your SSH keys set up, you need to update your `~/.gitconfig` file to use the correct alias for each directory.

```bash
# ~/.gitconfig__work
[user]
	email = san-siva@work.com
	name = Santhosh Siva
[pull]
	rebase = false
[submodule]
	recurse = true

# Add these lines to your work config
[url "git@github-work:"]
	insteadOf = git@github.com:
```

```bash
# ~/.gitconfig__sidegig
[user]
	email = san-siva@sidegig.com
	name = Santhosh Siva
[pull]
	rebase = false
[submodule]
	recurse = true

# Add these lines to your sidegig config
[url "git@github-sidegig:"]
	insteadOf = git@github.com:
```

This tells Git to use the `~/.ssh/work` key for your work directory, and the `~/.ssh/sidegig` key for your side project.

### Test your setup

Verify that SSH is authenticating with the correct account for each alias:

```bash
# Test the setup
ssh -T git@github        # Default, you should see the username linked to your personal github account
ssh -T git@github-work
ssh -T git@github-sidegig
```

If you see the right username for each, you're good to go.

## Conclusion

With this setup in place, you never have to worry about mixing up your Git identities again. Your commits will automatically be authored with the correct email, and your code will be pushed using the right SSH key based entirely on the folder you are working in.

The key insight here is the separation of concerns: "Git configs handle identity, and SSH configs handle access." Set it up once, and it all just works seamlessly in the background!
