function RepoList({ data }) {
    return (
        <div>
            <h2>GitHub Repositories</h2>

            <ul>
                {data.map((repo) => (
                    <li key={repo.id}>
                        <strong>{repo.name}</strong>

                        <br />

                        <a
                            href={repo.html_url}
                            target="_blank"
                            rel="noreferrer"
                        >
                            {repo.html_url}
                        </a>

                        <hr />
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default RepoList;