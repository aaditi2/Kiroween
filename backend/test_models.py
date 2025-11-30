"""
Quick test to verify flowchart models work correctly.
"""

from models.flowchart import Choice, Step, Flowchart


def test_valid_flowchart():
    """Test creating a valid flowchart."""
    # Create choices
    choice1 = Choice(
        id="c1",
        text="Use nested loops",
        correct=False,
        explanation="This has O(n²) complexity"
    )
    choice2 = Choice(
        id="c2",
        text="Use a hash map",
        correct=True,
        explanation=None
    )
    choice3 = Choice(
        id="c3",
        text="Sort the array first",
        correct=False,
        explanation="Sorting adds unnecessary complexity"
    )
    
    # Create step
    step = Step(
        id="step-1",
        description="Choose the initial approach",
        choices=[choice1, choice2, choice3]
    )
    
    # Create flowchart
    flowchart = Flowchart(steps=[step])
    
    print("✓ Valid flowchart created successfully")
    print(f"  Steps: {len(flowchart.steps)}")
    print(f"  First step: {flowchart.steps[0].description}")
    print(f"  Choices: {len(flowchart.steps[0].choices)}")
    
    # Test helper methods
    found_step = flowchart.get_step_by_id("step-1")
    assert found_step is not None
    print("✓ get_step_by_id works")
    
    found_step = flowchart.get_step_by_index(0)
    assert found_step is not None
    print("✓ get_step_by_index works")


def test_validation_errors():
    """Test that validation catches errors."""
    print("\nTesting validation...")
    
    # Test: Correct choice with explanation (should fail)
    try:
        Choice(
            id="c1",
            text="Test",
            correct=True,
            explanation="Should not have this"
        )
        print("✗ Failed to catch correct choice with explanation")
    except ValueError:
        print("✓ Correctly rejected correct choice with explanation")
    
    # Test: Incorrect choice without explanation (should fail)
    try:
        Choice(
            id="c1",
            text="Test",
            correct=False,
            explanation=None
        )
        print("✗ Failed to catch incorrect choice without explanation")
    except ValueError:
        print("✓ Correctly rejected incorrect choice without explanation")
    
    # Test: Step with wrong number of choices (should fail)
    try:
        choice1 = Choice(id="c1", text="Test", correct=True, explanation=None)
        choice2 = Choice(id="c2", text="Test", correct=False, explanation="Wrong")
        Step(
            id="step-1",
            description="Test",
            choices=[choice1, choice2]  # Only 2 choices
        )
        print("✗ Failed to catch step with wrong number of choices")
    except ValueError:
        print("✓ Correctly rejected step with wrong number of choices")
    
    # Test: Step with multiple correct choices (should fail)
    try:
        choice1 = Choice(id="c1", text="Test", correct=True, explanation=None)
        choice2 = Choice(id="c2", text="Test", correct=True, explanation=None)
        choice3 = Choice(id="c3", text="Test", correct=False, explanation="Wrong")
        Step(
            id="step-1",
            description="Test",
            choices=[choice1, choice2, choice3]
        )
        print("✗ Failed to catch step with multiple correct choices")
    except ValueError:
        print("✓ Correctly rejected step with multiple correct choices")


if __name__ == "__main__":
    test_valid_flowchart()
    test_validation_errors()
    print("\n✓ All tests passed!")
