from sma_incubyte import hello


def test_hello_returns_expected_greeting() -> None:
    assert hello() == "Hello from SMA Incubyte!"
