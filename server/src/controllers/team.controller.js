import {
    createMemberEntry,
    deleteMemberEntry,
    listMembers,
    updateMemberEntry,
} from '../services/workspace.service.js';

export async function getMembers(_req, res) {
    const members = await listMembers();
    res.json(members);
}

export async function postMember(req, res) {
    const createdMember = await createMemberEntry(req.validatedBody);
    res.status(201).json(createdMember);
}

export async function putMember(req, res) {
    const updatedMember = await updateMemberEntry(req.params.memberId, req.validatedBody);

    if (!updatedMember) {
        return res.status(404).json({
            message: 'Member not found.',
        });
    }

    return res.json(updatedMember);
}

export async function removeMember(req, res) {
    const deletedMember = await deleteMemberEntry(req.params.memberId);

    if (!deletedMember) {
        return res.status(404).json({
            message: 'Member not found.',
        });
    }

    return res.json({
        message: 'Member deleted successfully.',
        member: deletedMember,
    });
}
