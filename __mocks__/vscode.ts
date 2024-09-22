const vscodeMock = {
    window: {
        showInformationMessage: jest.fn(),
        // Add other VS Code API functions you need to mock here
    },
    // Add other VS Code namespaces you need to mock
};

test('placeholder', () => {
    // This test does nothing, but prevents the error
    expect(true).toBe(true); 
});

export default vscodeMock;
