import React from "react";
import axios from "./axios";

import { render, fireEvent, waitForElementToBeRemoved } from '@testing-library/react';

import BioEditor from './bioeditor';

jest.mock('./axios');

test('1. When no bio is passed to it, an "Add" button is rendered', () => {
    const {container} = render(
        <BioEditor />
    );
    expect(
        container.querySelector('button').innerHTML
    ).toContain('Add Bio');
});

test('2. When a bio is passed to it, an "Edit" button is rendered', () => {
    const {container} = render(
        <BioEditor bio="test bio" />
    );
    expect(
        container.querySelector('button').innerHTML
    ).toContain('Edit Bio');
});

test('3. Clicking either the "Add" or "Edit" button causes a textarea and a "Save" button to be rendered.', () => {

    const {container} = render(
        <BioEditor />
    );
    fireEvent.click(
        // this will only get 1 button with the class "edit-or-add-btn", but only one will be rendered so that should be what I want:
        container.querySelector('.edit-or-add-btn')
    );
    expect(
        container.innerHTML
    ).toContain('</textarea>');

    expect(
        container.querySelector('button').innerHTML
    ).toContain('Save');
});

test('4. Clicking the "Save" button causes an ajax request.', async () => {
    axios.post.mockResolvedValue({
        data: {
            success: true
        }
    });

    const {container} = render(
        <BioEditor />
    );
    fireEvent.click(
        // this will only get 1 button with the class "edit-or-add-btn", but only one will be rendered so that should be what I want:
        container.querySelector('.edit-or-add-btn')
    );
    fireEvent.click(
        // this will only get 1 button with the class "edit-or-add-btn", but only one will be rendered so that should be what I want:
        container.querySelector('.save-btn')
    );
    expect(axios.post.mock.calls.length).toBe(1);

});

test('5. When the mock request is successful, the function that was passed as a prop to the component gets called', async () => {
    axios.post.mockResolvedValue({
        data: {
            success: true
        }
    });

    const propFunction = jest.fn();
    const {container} = render(
        <BioEditor setBio={propFunction}/>
    );
    fireEvent.click(
        // this will only get 1 button with the class "edit-or-add-btn", but only one will be rendered so that should be what I want:
        container.querySelector('.edit-or-add-btn')
    );
    fireEvent.click(
        // this will only get 1 button with the class "edit-or-add-btn", but only one will be rendered so that should be what I want:
        container.querySelector('.save-btn')
    );
    // await wait();
    await waitForElementToBeRemoved(
        () => container.querySelector('.editing-bio')
    );

    expect(propFunction.mock.calls.length).toBe(1);

});
