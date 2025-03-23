# import ast


# def extract_dict_from_response(response_text):
#     """
#     Extracts a Python dictionary from a code-formatted string response.
#     Assumes the dictionary is enclosed in triple backticks and starts with ```python.
#     """
#     try:
#         # Find the first '{' and last '}' to isolate the dictionary content
#         start = response_text.find("{")
#         end = response_text.rfind("}") + 1

#         if start == -1 or end == -1:
#             raise ValueError("No dictionary content found in response.")

#         dict_str = response_text[start:end]

#         # Convert string to actual Python dictionary safely
#         data_dict = ast.literal_eval(dict_str)
#         return data_dict

#     except Exception as e:
#         # print("Failed to parse dictionary from response.")
#         print("Error:", e)
#         return None
