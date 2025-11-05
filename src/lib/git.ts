import simpleGit, { SimpleGit, LogResult } from 'simple-git';
import type { GitCommit } from '@/types';

const repoPath = import.meta.env.VITE_GIT_REPO_PATH || '.';

let git: SimpleGit;

try {
  git = simpleGit(repoPath);
} catch (error) {
  console.error('Failed to initialize git:', error);
  git = simpleGit();
}

export async function getRecentCommits(
  limit: number = 50
): Promise<GitCommit[]> {
  try {
    const log: LogResult = await git.log({ maxCount: limit });

    const commits: GitCommit[] = await Promise.all(
      log.all.map(async (commit) => {
        const diff = await git.show([
          '--name-only',
          '--pretty=format:',
          commit.hash,
        ]);

        const files = diff
          .split('\n')
          .filter((line) => line.trim() !== '');

        return {
          sha: commit.hash,
          message: commit.message,
          author: commit.author_name,
          date: commit.date,
          files_changed: files,
        };
      })
    );

    return commits;
  } catch (error) {
    console.error('Error fetching commits:', error);
    return [];
  }
}

export async function getCommitsSince(since: Date): Promise<GitCommit[]> {
  try {
    const log: LogResult = await git.log({
      from: since.toISOString(),
    });

    const commits: GitCommit[] = await Promise.all(
      log.all.map(async (commit) => {
        const diff = await git.show([
          '--name-only',
          '--pretty=format:',
          commit.hash,
        ]);

        const files = diff
          .split('\n')
          .filter((line) => line.trim() !== '');

        return {
          sha: commit.hash,
          message: commit.message,
          author: commit.author_name,
          date: commit.date,
          files_changed: files,
        };
      })
    );

    return commits;
  } catch (error) {
    console.error('Error fetching commits since date:', error);
    return [];
  }
}

export async function getCurrentBranch(): Promise<string> {
  try {
    const status = await git.status();
    return status.current || 'unknown';
  } catch (error) {
    console.error('Error getting current branch:', error);
    return 'unknown';
  }
}

export async function getRepositoryInfo() {
  try {
    const remotes = await git.getRemotes(true);
    const branch = await getCurrentBranch();
    const status = await git.status();

    return {
      branch,
      remotes,
      ahead: status.ahead,
      behind: status.behind,
      modified: status.modified,
      created: status.created,
      deleted: status.deleted,
    };
  } catch (error) {
    console.error('Error getting repository info:', error);
    return null;
  }
}
