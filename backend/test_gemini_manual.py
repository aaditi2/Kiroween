"""
Manual test script for GeminiClient.
This script tests the basic functionality without making actual API calls.
"""
from gemini_client import GeminiClient
import json


def test_initialization():
    """Test client initialization."""
    print("Testing initialization...")
    
    # Test with valid API key
    try:
        client = GeminiClient("test-api-key-123")
        print("✓ Client initialized successfully with valid API key")
    except Exception as e:
        print(f"✗ Failed to initialize client: {e}")
        return False
    
    # Test with empty API key
    try:
        client = GeminiClient("")
        print("✗ Should have raised ValueError for empty API key")
        return False
    except ValueError:
        print("✓ Correctly raised ValueError for empty API key")
    
    return True


def test_build_prompt():
    """Test prompt building."""
    print("\nTesting prompt building...")
    
    client = GeminiClient("test-api-key")
    problem = "Find the maximum element in an array"
    
    prompt = client._build_prompt(problem)
    
    # Check that prompt contains the problem
    if problem in prompt:
        print("✓ Prompt contains the problem text")
    else:
        print("✗ Prompt missing problem text")
        return False
    
    # Check for key instructions
    if "JSON" in prompt and "steps" in prompt and "choices" in prompt:
        print("✓ Prompt contains JSON format instructions")
    else:
        print("✗ Prompt missing format instructions")
        return False
    
    return True


def test_parse_response():
    """Test response parsing."""
    print("\nTesting response parsing...")
    
    client = GeminiClient("test-api-key")
    
    # Test with clean JSON
    clean_json = '''
    {
      "steps": [
        {
          "id": "step-1",
          "description": "Choose approach",
          "choices": [
            {"id": "choice-1", "text": "Option 1", "correct": false, "explanation": "Wrong because..."},
            {"id": "choice-2", "text": "Option 2", "correct": true, "explanation": null},
            {"id": "choice-3", "text": "Option 3", "correct": false, "explanation": "Wrong because..."}
          ]
        }
      ]
    }
    '''
    
    try:
        result = client._parse_response(clean_json)
        print("✓ Parsed clean JSON successfully")
    except Exception as e:
        print(f"✗ Failed to parse clean JSON: {e}")
        return False
    
    # Test with markdown code blocks
    markdown_json = '''```json
    {
      "steps": [
        {
          "id": "step-1",
          "description": "Choose approach",
          "choices": [
            {"id": "choice-1", "text": "Option 1", "correct": false, "explanation": "Wrong"},
            {"id": "choice-2", "text": "Option 2", "correct": true, "explanation": null},
            {"id": "choice-3", "text": "Option 3", "correct": false, "explanation": "Wrong"}
          ]
        }
      ]
    }
    ```'''
    
    try:
        result = client._parse_response(markdown_json)
        print("✓ Parsed markdown-wrapped JSON successfully")
    except Exception as e:
        print(f"✗ Failed to parse markdown JSON: {e}")
        return False
    
    return True


def test_validate_flowchart():
    """Test flowchart validation."""
    print("\nTesting flowchart validation...")
    
    client = GeminiClient("test-api-key")
    
    # Valid flowchart
    valid_flowchart = {
        "steps": [
            {
                "id": "step-1",
                "description": "Choose the approach",
                "choices": [
                    {"id": "choice-1", "text": "Option 1", "correct": False, "explanation": "Wrong because X"},
                    {"id": "choice-2", "text": "Option 2", "correct": True, "explanation": None},
                    {"id": "choice-3", "text": "Option 3", "correct": False, "explanation": "Wrong because Y"}
                ]
            }
        ]
    }
    
    try:
        client._validate_flowchart(valid_flowchart)
        print("✓ Valid flowchart passed validation")
    except Exception as e:
        print(f"✗ Valid flowchart failed validation: {e}")
        return False
    
    # Invalid: missing steps
    try:
        client._validate_flowchart({})
        print("✗ Should have rejected flowchart without steps")
        return False
    except ValueError as e:
        print(f"✓ Correctly rejected flowchart without steps: {e}")
    
    # Invalid: wrong number of choices
    invalid_choices = {
        "steps": [{
            "id": "step-1",
            "description": "Test",
            "choices": [
                {"id": "choice-1", "text": "Option 1", "correct": True, "explanation": None}
            ]
        }]
    }
    
    try:
        client._validate_flowchart(invalid_choices)
        print("✗ Should have rejected step with wrong number of choices")
        return False
    except ValueError as e:
        print(f"✓ Correctly rejected wrong number of choices: {e}")
    
    # Invalid: no correct choice
    no_correct = {
        "steps": [{
            "id": "step-1",
            "description": "Test",
            "choices": [
                {"id": "choice-1", "text": "Option 1", "correct": False, "explanation": "Wrong"},
                {"id": "choice-2", "text": "Option 2", "correct": False, "explanation": "Wrong"},
                {"id": "choice-3", "text": "Option 3", "correct": False, "explanation": "Wrong"}
            ]
        }]
    }
    
    try:
        client._validate_flowchart(no_correct)
        print("✗ Should have rejected step with no correct choice")
        return False
    except ValueError as e:
        print(f"✓ Correctly rejected step with no correct choice: {e}")
    
    return True


def main():
    """Run all tests."""
    print("=" * 60)
    print("GeminiClient Manual Tests")
    print("=" * 60)
    
    tests = [
        test_initialization,
        test_build_prompt,
        test_parse_response,
        test_validate_flowchart
    ]
    
    results = []
    for test in tests:
        try:
            result = test()
            results.append(result)
        except Exception as e:
            print(f"\n✗ Test failed with exception: {e}")
            results.append(False)
    
    print("\n" + "=" * 60)
    print(f"Results: {sum(results)}/{len(results)} tests passed")
    print("=" * 60)
    
    return all(results)


if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)
