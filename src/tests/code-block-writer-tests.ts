﻿import * as assert from "assert";
import CodeBlockWriter from "./../code-block-writer";

function getWriter() {
    return new CodeBlockWriter();
}

function doTest(expected: string, writerCallback: (writer: CodeBlockWriter) => void) {
    const writer = getWriter();
    writerCallback(writer);
    assert.equal(writer.toString(), expected);
}

describe("CodeBlockWriter", () => {
    describe("write", () => {
        it("should write the text", () => {
            const expected = `test`;

            doTest(expected, writer => {
                writer.write("test");
            });
        });
    });

    describe("block()", () => {
        it("should write text inside a block", () => {
            const expected =
`test {
    inside
}
`;
            doTest(expected, writer => {
                writer.write("test").block(() => {
                    writer.write("inside");
                });
            });
        });

        it("should write text inside a block inside a block", () => {
            const expected =
`test {
    inside {
        inside again
    }
}
`;

            doTest(expected, writer => {
                writer.write("test").block(() => {
                    writer.write("inside").block(() => {
                        writer.write("inside again");
                    });
                });
            });
        });

        it("should not do an extra space if there was a space added before the block", () => {
            const expected =
`test {
    inside
}
`;
            doTest(expected, writer => {
                writer.write("test ").block(() => {
                    writer.write("inside");
                });
            });
        });

        it("should put the brace on the next space if there is a newline before it", () => {
            const expected =
`test {
    inside

    inside
}
`;
            doTest(expected, writer => {
                writer.write("test ").block(() => {
                    writer.writeLine("inside").newLine().write("inside");
                });
            });
        });
    });

    describe("writeLine()", () => {
        it("should write some text on a line", () => {
            const expected = `test\n`;

            doTest(expected, writer => {
                writer.writeLine("test");
            });
        });

        it("should start writing on a newline if the last one was just writing", () => {
            const expected = `test\ntest\ntest\n`;

            doTest(expected, writer => {
                writer.writeLine("test").write("test").writeLine("test");
            });
        });

        it("should not create a newline between two writeLines", () => {
            const expected = `test\ntest\n`;

            doTest(expected, writer => {
                writer.writeLine("test").writeLine("test");
            });
        });
    });

    describe("newLineIfLastCharNotNewLine()", () => {
        it("should do a newline if the last text was not a newline", () => {
            const expected = `test\n`;

            doTest(expected, writer => {
                writer.write("test").newLineIfLastCharNotNewLine();
            });
        });

        it("should not do a newline if the last text was a newline", () => {
            const expected = `test\n`;

            doTest(expected, writer => {
                writer.writeLine("test").newLineIfLastCharNotNewLine();
            });
        });
    });

    describe("newLine()", () => {
        it("should do a newline when writing", () => {
            const expected = `test\n`;

            doTest(expected, writer => {
                writer.write("test").newLine();
            });
        });

        it("should do a newline after doing a newline", () => {
            const expected = `test\n\n`;

            doTest(expected, writer => {
                writer.write("test").newLine().newLine();
            });
        });

        it("should not do a newline after doing a block", () => {
            const expected = `test {\n    test\n}\n`;

            doTest(expected, writer => {
                writer.write("test").block(() => {
                    writer.newLine().writeLine("test");
                });
            });
        });

        it("should not do a newline if the last line was a blank line (no consecutive blank lines)", () => {
            const expected = `test\n\n`;

            doTest(expected, writer => {
                writer.write("test").newLine().newLine().newLine();
            });
        });

        it("should do a newline if a string causes it to not be a consecutive blank line", () => {
            const expected = `test\na\n\n`;

            doTest(expected, writer => {
                writer.write("test").newLine().write("a").newLine().newLine();
            });
        });
    });

    describe("spaceIfLastNotSpace()", () => {
        it("should do a space if the last character wasn't a space", () => {
            const expected = `test `;

            doTest(expected, writer => {
                writer.write("test").spaceIfLastNotSpace();
            });
        });

        it("should not do a space if the last character was a space", () => {
            const expected = `test `;

            doTest(expected, writer => {
                writer.write("test").spaceIfLastNotSpace().spaceIfLastNotSpace();
            });
        });

        it("should not do a space if the last character was a newline", () => {
            const expected = `test\n`;

            doTest(expected, writer => {
                writer.write("test").newLine().spaceIfLastNotSpace();
            });
        });
    });

    describe("getLength()", () => {
        it("should return the length", () => {
            const writer = getWriter();
            writer.write("1234");
            assert.equal(writer.getLength(), 4);
        });
    });
});